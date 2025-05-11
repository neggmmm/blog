import User from "../model/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';

dotenv.config(); // ✅ load env variables

export const createUser = async(req,res) => {
    try {
        const { email, username, password } = req.body;
        if(!email || !username || !password) {
            return res.status(400).json({message: "Please fill all fields"});
        }

        const user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if(user) {
            return res.status(401).json({message: "Email or username already exists!"});
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ 
            email, 
            password: hashedPassword, 
            username,
            isEmailVerified: true // Set to true for now
        });

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ 
            message: "Registered successfully!", 
            token 
        });
    } catch(err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: err.message || "Server error" });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Server error" });
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if the email exists or not
            return res.status(200).json({ 
                message: "If your email is registered, you will receive password reset instructions." 
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        // Send reset email
        await sendPasswordResetEmail(email, resetToken);

        res.status(200).json({ 
            message: "If your email is registered, you will receive password reset instructions." 
        });
    } catch (err) {
        console.error('Password reset request error:', err);
        res.status(500).json({ message: "An error occurred. Please try again later." });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
      console.log("Request body:", req.body); // Debugging
  
      const { emailOrUsername, password } = req.body;
  
      // Validate input
      if (!emailOrUsername || !password) {
        return res.status(400).json({ message: "Email/username and password are required" });
      }
  
      // Normalize input
      const normalizedInput = emailOrUsername.trim().toLowerCase();
      const user = await User.findOne({
        $or: [
          { email: normalizedInput },
          { username: normalizedInput }
        ]
      });
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Incorrect credentials" });
      }
  
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log(`token: ${token}`)
      res.status(200).json({ message: "Logged in successfully!", token });
    } catch (err) {
      res.status(500).json({ error: err.message || "Server error" });
    }
  };

  export const getUser = async (rec,res) => {
    try{
      const { id } = req.params; // ✅ get ID from the URL
      const user = await User.findById(id).select('-password'); // ✅ exclude password from response
      if (!user) return res.status(404).json({ message: "User not found" });
      
      res.status(200).json(user);
    }catch(err){
      res.status(500).json({error:err.message});
    }
  }

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Error getting user data' });
  }
};