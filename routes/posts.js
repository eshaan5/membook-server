import express from 'express';

import { getPosts, createPost, updatePost, deletePost, likePost, getPostsBySearch, getPost, commentPost } from '../controllers/posts.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', getPosts);
router.get('/search', getPostsBySearch)
router.get('/:id', getPost);

router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost); // used for updating existing document
router.delete('/:id', auth, deletePost); // used for deleting existing document
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', auth, commentPost)

export default router;