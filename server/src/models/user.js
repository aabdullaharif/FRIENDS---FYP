const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter your first name"],
            maxLength: [60, "Name should have less than 60 characters"],
            minLength: [3, "Name should be greater than 3 characters"],
        },
        email: {
            type: String,
            required: [true, "Enter your email"],
            validate: [validator.isEmail, "Enter a valid email"],
            unique: true,
        },
        username: {
            type: String,
            required: [true, "Enter your username"],
            unique: true,
            maxLength: [60, "Name should have less than 60 characters"],
            minLength: [3, "Name should be greater than 3 characters"],
        },
        password: {
            type: String,
            required: [true, "Enter your password"],
            minLength: [8, "Password should be have 8 characters"],
            select: false,
        },
        profile_image_url: {
            type: String
        },
        post_count: {
            type: Number,
            default: 0,
        },
        follower_count: {
            type: Number,
            default: 0,
        },
        following_count: {
            type: Number,
            default: 0,
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        followings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        bio: {
            type: String,
            maxLength: [300, "Bio should have less than 300 characters"],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user"],
            default: "user",
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "private"
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Generate JWT
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Reset Password Token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
