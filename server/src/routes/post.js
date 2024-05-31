const express = require("express");
const { authenticatedUser } = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const { createPost, getPost, getPosts, likePost, deletePost, getPublicPosts, recommendedPost } = require("../controllers/post");
const router = express.Router();

router.route("/posts").post(authenticatedUser, upload.single("media"), createPost).get(authenticatedUser, getPosts);
router.route("/public/posts").get(authenticatedUser, getPublicPosts);
router.route("/recommended/posts").get(authenticatedUser, recommendedPost);
router.route("/posts/:id").get(authenticatedUser, getPost).put(authenticatedUser, likePost).delete(deletePost);

module.exports = router;