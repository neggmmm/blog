// app.js
import express from 'express';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js'
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
export default app;
