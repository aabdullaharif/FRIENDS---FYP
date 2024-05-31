const randomImageName = require("./randomString");
const sharp = require('sharp');
const { uploadMediaToS3 } = require("../config/s3");
const ErrorHandler = require("./errorHandler");
const { S3_BUCKET_NAME, AWS_GET_BASE_URL } = process.env;


async function processProfileImage(buffer, mType) {
    if (!buffer) return null;

    const randomImgName = randomImageName(16);
    let bufferImg;

    try {
        bufferImg = await sharp(buffer)
            .resize({ width: 120, height: 120, fit: 'contain' })
            .toBuffer();
    } catch (error) {
        return new ErrorHandler("Failed to process profile image", 500);
    }

    try {
        await uploadMediaToS3(
            S3_BUCKET_NAME,
            randomImgName,
            bufferImg,
            mType
        );
        return `${AWS_GET_BASE_URL}/${randomImgName}`;
    } catch (error) {
        console.log(error);
        return "https://ibit-friends-data.s3.ap-south-1.amazonaws.com/default-profile.png";
        // return new ErrorHandler("Failed to upload profile image", 500);
    }
}

async function processUserPost(buffer, mType) {
    if (!buffer) return null;

    const randomImgName = randomImageName(16);
    let bufferImg;

    try {
        bufferImg = await sharp(buffer)
            .resize({ width: 1080, height: 1080, fit: 'cover' })
            .toBuffer();
    } catch (error) {
        return new ErrorHandler("Failed to process profile image", 500);
    }


    try {
        await uploadMediaToS3(
            S3_BUCKET_NAME,
            randomImgName,
            bufferImg,
            mType
        );
        return `${AWS_GET_BASE_URL}/${randomImgName}`;
    } catch (error) {
        console.log(error);
        return "https://ibit-friends-data.s3.ap-south-1.amazonaws.com/7457e365bef1c9b1fe7a6147199f52e1";
    }
}


module.exports = { processProfileImage, processUserPost };