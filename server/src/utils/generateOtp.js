const otpGenerator = require("otp-generator");


function generateOTP() {
    return otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
        alphabets: false,
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
    });
}

module.exports = generateOTP;