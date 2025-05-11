import mongoose from 'mongoose';
import User from '../model/User.js';
import Post from '../model/Post.js';
import Comment from '../model/Comment.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanup = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Delete all comments first (to avoid foreign key constraints)
        const commentResult = await Comment.deleteMany({});
        console.log(`Deleted ${commentResult.deletedCount} comments`);

        // Delete all posts
        const postResult = await Post.deleteMany({});
        console.log(`Deleted ${postResult.deletedCount} posts`);

        // Delete all users
        const userResult = await User.deleteMany({});
        console.log(`Deleted ${userResult.deletedCount} users`);

        console.log('Cleanup completed successfully');
    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the cleanup
cleanup(); 