const express = require("express");
const { getUserDetails, deleteUser, searchUsers, getUserById, getPostsById, followUser, checkRequest, checkFollowing, userFollowings, userFollowers, getUsers, changeUserVisibility, updateUserDetails } = require("../controllers/user");
const { authenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.route("/me").get(authenticatedUser, getUserDetails).put(authenticatedUser, updateUserDetails);
router.route("/user/:id").delete(authenticatedUser, deleteUser).get(authenticatedUser, getUserById);

router.route("/search").get(authenticatedUser, searchUsers);
router.route("/user/:id/posts").get(authenticatedUser, getPostsById);

router.route("/user/:id/follow").put(authenticatedUser, followUser);
router.route("/user/request/:id").get(authenticatedUser, checkRequest);
router.route("/user/following/:id").get(authenticatedUser, checkFollowing);
router.route("/user/:id/followings").get(authenticatedUser, userFollowings);
router.route("/user/:id/followers").get(authenticatedUser, userFollowers);

router.route("/users/list").get(authenticatedUser, getUsers);
router.route("/user/visibility").put(authenticatedUser, changeUserVisibility);

module.exports = router;