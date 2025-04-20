// routes/postRoutes.js
import express from 'express';
import { getPosts, createPost, deletePost, updatePost, likePost, addComment } from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/:id/like', authMiddleware, likePost);
router.get('/',authMiddleware, getPosts);
router.post('/', authMiddleware, createPost);
router.delete('/:id',deletePost);
router.put('/:id',updatePost)
router.post('/:id/comments', authMiddleware, addComment);

export default router;
