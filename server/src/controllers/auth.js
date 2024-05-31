const asyncHandler = require("../middlewares/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user");
const sendToken = require("../utils/jwtToken");
const { sendMail } = require("../config/nodemailer");
const generateOTP = require("../utils/generateOtp");
const { processProfileImage, processUserPost } = require("../utils/uploadImageToS3");


// @desc Register User
// @route POST /api/register
// @access PUBLIC
exports.registerUser = asyncHandler(async (req, res, next) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return next(new ErrorHandler("Missing required fields", 400));
    }

    const user = await User.create({
        name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
    });

    user.otp = generateOTP();
    await user.save();

    const subject = "OTP for Registration of FRIENDS";
    const body = `<h3>Your OTP for Registration is ${user.otp}</h3>`;

    try {
        await sendMail({
            email,
            subject,
            message: body
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to send OTP email", 500));
    }

    // Send the token response
    sendToken(user, 201, res);
});

// @desc Login User
// @route POST /api/login
// @access PUBLIC
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Enter Email & Password"), 400); // 400 - Bad Request
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401)); // 401 - Unauthorized
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
});

// @desc Complete User Registration
// @route PUT /api/complete/registration
// @access PRIVATE
exports.completeRegistration = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const { base64String, mType, bio } = req.body;

    let profileImageUrl;

    if(base64String && mType){
        const buffer = Buffer.from(base64String, 'base64');
    
        profileImageUrl = await processProfileImage(buffer, mType);
    }
   

    if (bio)
        user.bio = bio;

    if (profileImageUrl)
        user.profile_image_url = profileImageUrl;

    if(bio || profileImageUrl)
        await user.save();

    sendToken(user, 200, res);
})

// @desc Logout User
// @route POST /api/logout
// @access PUBLIC
exports.logoutUser = asyncHandler(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// @desc Verify User
// @route POST /api/verifyOtp
// @access PUBLIC
exports.verifyOtp = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp)
        return res.status(400).json({ message: "Enter all fields" });

    const user = await User.findOne({ email });
    if (!user)
        return res.status(404).json({ message: "This Email doesn't exist" });

    if (user.otp !== otp)
        return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = null;
    await user.save();

    sendToken(user, 200, res);
});

// @desc Resend OTP
// @route POST /api/resentOtp
// @access PUBLIC
exports.resendOtp = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: "Enter email" });

    const user = await User.findOne({ email });
    if (!user)
        return res.status(404).json({ message: "This Email doesn't exist" });

    const otp = generateOTP();

    const subject = "OTP for Registration of FRIENDS";
    const body = `<h3>Your OTP for Registration is ${otp}</h3>`;

    await sendMail({
        email,
        subject,
        message: body
    });

    user.otp = otp;
    await user.save();

    return res.status(200).json({ message: "OTP is sent successfully" });
});