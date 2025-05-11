import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        unique: true, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;

