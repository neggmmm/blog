import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send verification email
export const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    
    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL, // verified sender email
        subject: 'Verify Your Email',
        html: `
            <h1>Email Verification</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
            <p>This link will expire in 24 hours.</p>
        `
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'Password Reset Request',
        html: `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
}; 