import express from 'express'
import { 
    createUser, 
    getUser, 
    loginUser, 
    getCurrentUser,
    verifyEmail,
    requestPasswordReset,
    resetPassword
} from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', createUser);
router.post('/login', loginUser);

// Email verification and password reset routes
router.get('/verify-email', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// User routes
router.get('/me', authMiddleware, getCurrentUser);
router.get('/:id', getUser);

export default router