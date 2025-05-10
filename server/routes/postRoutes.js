// routes/postRoutes.js
import express from 'express';
import { getPosts, createPost, deletePost, updatePost, upVotePost, downVotePost ,getPostById} from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/:id/upvote', authMiddleware, upVotePost);  //✅
router.put('/:id/downvote', authMiddleware, downVotePost);  //✅
router.get('/', authMiddleware, getPosts); //✅
router.post('/', authMiddleware, createPost); //✅
router.delete('/:id', authMiddleware, deletePost); //✅
router.put('/:id', authMiddleware, updatePost); //✅
router.get('/:id', authMiddleware, getPostById); // ✅
export default router;
