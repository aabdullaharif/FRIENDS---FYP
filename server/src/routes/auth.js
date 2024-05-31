const express = require("express");
const { registerUser, loginUser, logoutUser, verifyOtp, resendOtp, completeRegistration } = require("../controllers/auth");
const upload = require('../middlewares/multer');
const { authenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(upload.single("profile"), registerUser);
router.route("/completeRegistration").put(authenticatedUser, upload.single("profile"), completeRegistration);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/verifyOtp").post(verifyOtp);
router.route("/resendOtp").post(resendOtp);

module.exports = router;