import crypto from 'crypto';
import User from '../model/User.js';
import VerificationToken from '../model/VerificationToken.js';
import { sendVerificationEmail } from '../utils/emailService.js';

export const sendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');

    // Save verification token
    await VerificationToken.findOneAndDelete({ userId: user._id }); // Remove any existing tokens
    await VerificationToken.create({
      userId: user._id,
      token
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, token);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error in sendVerification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const verificationToken = await VerificationToken.findOne({ token });
    if (!verificationToken) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    const user = await User.findById(verificationToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();
    await VerificationToken.deleteOne({ token });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 