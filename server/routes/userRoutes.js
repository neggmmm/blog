import express from 'express'
import { createUser , loginUser } from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', createUser)
router.post('/login', loginUser)
export default router