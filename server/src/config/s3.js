const {
    PutObjectCommand,
    S3Client,
    DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
require('dotenv').config();

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_REGION } = process.env;

const s3 = new S3Client({
    region: S3_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
})

const uploadMediaToS3 = async (bucketName, imgName, imgBuffer, imgMime) => {
    const params = {
        Bucket: bucketName,
        Key: imgName,
        Body: imgBuffer,
        ContentType: imgMime,
    }

    const command = new PutObjectCommand(params)
    await s3.send(command)
}

const deleteMediaFromS3 = async (bucketName, imgName) => {
    const params = {
        Bucket: bucketName,
        Key: imgName,
    }
    const command = new DeleteObjectCommand(params)
    await s3.send(command)
}

module.exports = { uploadMediaToS3, deleteMediaFromS3 }
