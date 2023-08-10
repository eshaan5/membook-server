// this file is same as postMessage.js

import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: String,
    caption: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: String, // image to string
    likes: {
        type: [String],
        default: []
    },
    comments: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const Post = mongoose.model("Post", postSchema);

export default Post;