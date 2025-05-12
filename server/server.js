// server.js
import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
connectDB();

// app.use(cors({
//   origin: 'http://localhost:3000', // allow React app
//   credentials: true // if you're sending cookies or auth headers
// }));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
