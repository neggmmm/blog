// routes/postRoutes.js
import express from 'express';
import { 
  getPosts, 
  createPost, 
  deletePost, 
  updatePost, 
  upVotePost, 
  downVotePost,
  getPostById 
} from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validatePost } from '../middleware/validatePost.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all posts with pagination
router.get('/', getPosts);

// Get single post
router.get('/:id', getPostById);

// Create post with validation
router.post('/', validatePost, createPost);

// Update post with validation
router.put('/:id', validatePost, updatePost);

// Delete post
router.delete('/:id', deletePost);

// Voting routes
router.put('/:id/upvote', upVotePost);
router.put('/:id/downvote', downVotePost);

export default router;
