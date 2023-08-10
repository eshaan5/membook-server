// here we have all the logic for the routes

import Post from "../models/post.js";
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8; // limit of posts per page
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const total = await Post.countDocuments({}); // get the total number of posts

        const posts = await Post.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex); // get the posts for the current page

        return (res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) }));
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Query = /posts?page=1
// Params = /posts/:id

export const getPostsBySearch = async (req, res) => {

    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, 'i'); // i = case insensitive
        const posts = await Post.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ] }); // $in = if tags array contains any of the tags in the query, $or = either title or tags
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {

    const newPost = new Post({...req.body, creator: req.userId, createdAt: new Date().toISOString()});

    try {
        
        await newPost.save();

        res.status(201).json(newPost);

    } catch (error) {
        
        res.status(409).json({ message: error.message });

    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id'); // validating the received id

    const updatedPost = await Post.findByIdAndUpdate(_id, post, { new: true })

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id'); // validating the received id

    await Post.findByIdAndRemove(id);

    res.json({ message: 'Post deleted successfully' });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if(!req.userId) return res.json({ message: 'Unauthenticated User' }) // userId is provided by the middleware

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id'); // validating the received id

    const post = await Post.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId)); // check if the user has already liked the post, every like is stored with the user id

    if(index === -1) {
        // like the post
        post.likes.push(req.userId);
    } else {
        // dislike the post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    const post = await Post.findById(id);
    post.comments.push(comment);

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost);

}