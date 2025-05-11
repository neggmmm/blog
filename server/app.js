// app.js
import express from 'express';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true 
}));

// Apply rate limiting to routes
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', commentRoutes);

// Error handling
app.use(errorHandler);

export default app;