const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "User is required"]
        },
        mediaUrl: {
            type: String,
            required: [true, "Post media is required"]
        },
        caption: {
            type: String
        },
        likes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: [true, "User is required to like"]
                }
            }
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: [true, "User is required to comment"]
                },
                text: {
                    type: String,
                    required: [true, "Comment text is required"]
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ], 
    },
    { timestamps: true }
)

const Post = mongoose.model("Post", postSchema);
module.exports = Post;