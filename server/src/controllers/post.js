const asyncHandler = require("../middlewares/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");
const Post = require("../models/post");
const User = require("../models/user");
const { processUserPost } = require("../utils/uploadImageToS3");
const shuffleArray = require("../utils/shuffleArr");
const Buffer = require('buffer').Buffer;

// @desc Create Post
// @route POST /api/posts
// @access PRIVATE
exports.createPost = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler('Unauthorized'), 401);
    }
    const { base64String, mType, caption } = req.body;
    const buffer = Buffer.from(base64String, 'base64');

    let profileImageUrl = await processUserPost(buffer, mType);

    const post = await Post.create({
        user: user._id,
        caption: caption,
        mediaUrl: profileImageUrl
    })

    user.post_count += 1;
    await user.save();

    res.status(201).json({
        success: true,
        post
    })
});

// @desc Delete Post
// @route DELETE /api/posts/:id
// @access PRIVATE
exports.deletePost = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler('Unauthorized', 401));
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorHandler('Post not found', 404));
    }
    if (post.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('User not authorized to delete this post', 401));
    }

    await post.remove();

    user.post_count -= 1;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
    })
});

// @desc Get Post
// @route GET /api/posts/:id
// @access PRIVATE
exports.getPost = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
        return next(new ErrorHandler("Unauthorized", 401));
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found',
        });
    }

    // if (post.user.toString() !== user._id.toString()) {
    //     return next(new ErrorHandler('Forbidden', 403));
    // }

    res.status(200).json({
        success: true,
        post,
    })
});

// @desc Get Curr User Posts
// @route GET /api/posts
// @access PRIVATE
exports.getPosts = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
        return next(new ErrorHandler("Unauthorized", 401));
    }

    const posts = await Post.find({ user: user._id });

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

// @desc Like a Post
// @route PUT /api/posts/:id/like
// @access PRIVATE
exports.likePost = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
        return next(new ErrorHandler("Unauthorized", 401));
    }
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
        return next(new ErrorHandler('No post found'), 404);
    }

    const alreadyLiked = post.likes.some(like => like.user.toString() === user._id.toString());

    if (alreadyLiked) {
        post.likes = post.likes.filter(({ user }) => user.toString() !== user._id.toString());
    } else {
        post.likes.push({ user: user._id });
    }

    await post.save();

    res.status(200).json({
        success: true,
        post
    });
});


// @desc Get Public User Posts at random based on user visibility
// @route GET /api/public/posts
// @access PRIVATE (needs authentication)
exports.getPublicPosts = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
        return next(new ErrorHandler("Unauthorized", 401));
    }

    const publicUsers = await User.find({ visibility: 'public' }, '_id');
    const userIds = publicUsers.map(user => user._id);
    let posts = await Post.find({
        user: { $in: userIds }
    })
        .populate("user", "name username profile_image_url");

    shuffleArray(posts);

    const remainder = posts.length % 3;
    if (remainder !== 0) {
        posts = posts.slice(0, posts.length - remainder);
    }

    res.status(200).json({
        success: true,
        posts
    })
});

// @desc Get User Following Posts
// @route GET /api/recommended/posts
// @access PRIVATE
exports.recommendedPost = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
        return next(new ErrorHandler("Unauthorized", 401));
    }

    let posts = await Post.aggregate([
        { $match: { user: { $in: user.followings } } },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: '$user',
                posts: { $push: '$$ROOT' }
            }
        },
        {
            $unwind: {
                path: '$posts',
                includeArrayIndex: 'postIndex'
            }
        },
        { $sort: { postIndex: 1, 'posts.createdAt': -1 } },
        {
            $group: {
                _id: null,
                postGroup: {
                    $push: '$posts'
                }
            }
        },
        { $unwind: '$postGroup' },
        {
            $replaceRoot: { newRoot: '$postGroup' }
        },
        {
            $lookup: {
                from: 'users',
                let: { userId: "$user" },
                pipeline: [
                    { 
                        $match: {
                            $expr: {
                                $eq: [ "$_id", "$$userId" ]
                            }
                        }
                    }
                ],
                as: 'userDetails'
            }
        },
        {
            $project: {
                _id: 1,
                mediaUrl: 1,
                caption: 1,
                likes: 1,
                comments: 1,
                createdAt: 1,
                updatedAt: 1,
                user: {
                    $let: {
                        vars: { userDetail: { $arrayElemAt: ['$userDetails', 0] } },
                        in: {
                            _id: '$$userDetail._id',
                            name: '$$userDetail.name',
                            username: '$$userDetail.username',
                            profile_image_url: '$$userDetail.profile_image_url'
                        }
                    }
                }
            }
        }
    ]);
   
    res.status(200).json({
        success: true,
        count: posts.length,
        posts
    });
});
