import express from 'express'
import { createUser, getUser, loginUser, getCurrentUser } from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', createUser); //✅
router.post('/login', loginUser); //✅
router.get('/me', authMiddleware, getCurrentUser);
router.get('/:id', getUser);
export default router