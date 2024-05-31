const asyncHandler = require("../middlewares/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.authenticatedUser = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token)
        return next(new ErrorHandler('Login to access this resource'), 401);

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData._id);
        next();
    } catch (error) {
        return next(new ErrorHandler('Invalid token', 401));
    }
})
