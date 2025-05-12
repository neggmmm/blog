import express from 'express';
import { sendVerification, verifyEmail } from '../controllers/verificationController.js';

const router = express.Router();

router.post('/send-verification', sendVerification);
router.get('/verify-email', verifyEmail);

export default router; 