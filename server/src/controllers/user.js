const asyncHandler = require("../middlewares/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user");
const Post = require("../models/post");
const sendToken = require("../utils/jwtToken");
const {processUserPost, processProfileImage} = require("../utils/uploadImageToS3");
const FollowRequest = require("../models/followRequest");
const pusher = require("../config/pusher");
const Buffer = require('buffer').Buffer;

// @desc Get User Details
// @route GET /api/me
// @access PRIVATE
exports.getUserDetails = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)

    res.status(200).json({
        success: true,
        user,
    })
});

// @desc Update User Details
// @route PUT /api/me
// @access PRIVATE
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler(`No User Found with ${id}`), 400);
    }

    const { base64String, mType, bio, name } = req.body;
    const updatedFields = {};
    if (bio) updatedFields.bio = bio;
    if (name) updatedFields.name = name;

    let profileImageUrl;
    if(base64String && mType){
        const buffer = Buffer.from(base64String, 'base64');
        profileImageUrl = await processProfileImage(buffer, mType);
    }

    if(profileImageUrl) updatedFields.profile_image_url = profileImageUrl;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: updatedFields }, { new: true });

    if (!updatedUser) {
        return next(new ErrorHandler(`User not found with id of ${req.user._id}`, 404));
    }

    sendToken(user, 200, res);
});

// @desc Delete a User, their Posts, Followers, and Followings
// @route DELETE /api/user/:id
// @access PRIVATE 
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userToDelete = await User.findById(id);

    if (!userToDelete) {
        return next(new ErrorHandler(`No User Found with id ${id}`, 404));
    }

    // Remove all posts by the user
    await Post.deleteMany({ user: id });

    // Update other users who are following the deleted user
    await User.updateMany(
        { _id: { $in: userToDelete.followers } },
        { $pull: { followings: id } }
    );

    // Update other users whom the deleted user is following
    await User.updateMany(
        { _id: { $in: userToDelete.followings } },
        { $pull: { followers: id } }
    );

    await userToDelete.deleteOne();

    res.status(200).json({
        success: true,
        message: 'User and all associated data deleted',
    });
});



// @desc Search User
// @route PUT /api/search
// @access PRIVATE 
exports.searchUsers = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { query } = req.query;

    const users = await User.find({
        _id: { $ne: userId }, // Exclude the current user by their ID
        username: { $regex: query, $options: 'i' },
    }).limit(5);

    if(!users){
        return res.status(500).json({ message: 'Error occurred during search' });
    }

    if(users.length < 1){
        return res.status(404).json({
            message: "No User exist with this query"
        })
    }
    
    res.status(200).json({
        success: true,
        users
    })
});

// @desc Get User by Id
// @route PUT /api/user/:id
// @access PRIVATE 
exports.getUserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id)

    if (!user) {
        return next(new ErrorHandler(`No User Found with ${id}`), 400)
    }

    res.status(200).json({
        success: true,
        user
    })
});

// @desc Get User Posts
// @route GET /api/user/:id/posts
// @access PRIVATE
exports.getPostsById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id)

    if(!user){
        return next(new ErrorHandler('No User Found'), 404);
    }
    
    const posts = await Post.find({user: user._id});

    if (!posts) {
        return res.status(404).json({
            success: false,
            message: 'Posts not found',
        });
    }

    res.status(200).json({
        success: true,
        posts
    })
});


// @desc Request to follow a user or follow directly if profile is public
// @route PUT /api/user/:id/follow
// @access PRIVATE
exports.followUser = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { id } = req.params;

    if (userId.equals(id)) {
        return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(id);

    if (!user || !targetUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const existingRequest = await FollowRequest.findOne({ 'fromUser': userId, 'toUser': id });

    if (existingRequest) {
        await FollowRequest.deleteOne({ _id: existingRequest._id });

        return res.status(200).json({
            success: true,
            message: "Request Canceled"
        });
    }

    if (targetUser.visibility === 'public') {
        const isAlreadyFollowing = user.followings.some(followingId => followingId.toString() === id);

        if(isAlreadyFollowing){
            user.followings.pull(id);
            targetUser.followers.pull(userId);
            user.following_count = Math.max(0, user.following_count - 1);
            targetUser.follower_count = Math.max(0, targetUser.follower_count - 1);

            await user.save();
            await targetUser.save();
            return res.status(200).json({
                success: true,
                message: "UnFollowing User",
            });
        }

        user.followings.push(id);
        targetUser.followers.push(userId);
        user.following_count += 1;
        targetUser.follower_count += 1;

        await user.save();
        await targetUser.save();

        pusher.trigger("friends", "follow-request", {
            fromUser: userId,
            toUser: id
        });

        return res.status(200).json({
            success: true,
            message: "Following User",
        });
        
    } else {
        const followRequest = new FollowRequest({
            fromUser: userId,
            toUser: id
        });
        await followRequest.save();

        pusher.trigger("friends", "follow-request", {
            fromUser: userId,
            toUser: id
        });

        return res.status(200).json({
            success: true,
            message: "Follow Request Sent",
        });
    }
});

// @desc Check Following
// @route GET /api/user/following/:id
// @access PRIVATE
exports.checkFollowing = asyncHandler(async (req, res, next) => {
    const currentUserId = req.user.id; 
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
        return res.status(400).json({
            success: false,
            message: "You cannot check following status for yourself",
        });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    const isFollowing = targetUser.followers.some(followerId => followerId.toString() === currentUserId);
    res.status(200).json({
        success: true,
        isFollowing,
    });

});

// @desc Check Request
// @route GET /api/user/request/:id
// @access PRIVATE
exports.checkRequest = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { id } = req.params;

    const request = await FollowRequest.findOne({
        fromUser: userId,
        toUser: id
    });

    if (!request) {
        return res.status(200).json({
            success: false
        });
    }

    res.status(200).json({
        success: true
    });

});

// @desc Get User Followings
// @route GET /api/user/:id/followings
// @access PRIVATE
exports.userFollowings = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const authUser = await User.findById({ _id });
    if(!authUser){
        return next(new ErrorHandler("Unauthorized"), 401)
    }

    const { id } = req.params;

    const user = await User.findById(id).populate('followings', 'name username profile_image_url');
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    const followings = user.followings;

    res.json({
        success: true,
        count: followings.length,
        followings,
    });

});

// @desc Get User Followers
// @route GET /api/user/:id/followers
// @access PRIVATE
exports.userFollowers = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const authUser = await User.findById({ _id });
    if(!authUser){
        return next(new ErrorHandler("Unauthorized"), 401)
    }

    const { id } = req.params;

    const user = await User.findById(id).populate('followers', 'name username profile_image_url');
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    const followers = user.followers;

    res.json({
        success: true,
        count: followers.length,
        followers,
    });

});


// @desc Get 10 Users who following_count or post_count or foloower_count is high, if no then simple find oldest 10 users
// @route GET /api/users/list
// @access PRIVATE
exports.getUsers = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById({ _id });

    if(!user){
        return next(new ErrorHandler("Unauthorized"), 401)
    }

    const users = await User.find({ _id: { $ne: _id } })
    .sort({
        follower_count: -1, 
        post_count: -1,     
        following_count: -1,
        createdAt: 1    
    })
    .limit(10);

    res.status(200).json({
        success: true,
        users
    });
});

// @desc Change Profile Visibility
// @route PUT /api/user/visibility
// @access PRIVATE
exports.changeUserVisibility = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById({ _id });

    if(!user){
        return next(new ErrorHandler("Unauthorized"), 401)
    }

    user.visibility = user.visibility === 'private' ? 'public' : 'private';
    await user.save();

    res.status(200).json({
        success: true,
        visibility: user.visibility
    });
});