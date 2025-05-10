// routes/commentRoutes.js
import express from 'express';
import { 
  addComment, 
  getComments, 
  deleteComment, 
  editComment
} from '../controllers/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:postId/comments', authMiddleware, addComment); //✅
router.put('/comments/:commentId' , authMiddleware ,editComment)
router.get('/:postId/comments', getComments); //✅
router.delete('/comments/:commentId', authMiddleware, deleteComment); //✅

export default router;