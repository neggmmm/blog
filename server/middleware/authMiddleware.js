// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
// Middleware function to protect routes
const authMiddleware = (req, res, next) => {
  try {
    // 1. Get token from headers (commonly sent in "Authorization")
    const authHeader = req.headers.authorization;

    // 2. Check if token is missing
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    // 3. Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // 4. Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Add user info to the request object
    req.user = decoded;
    console.log("🔐 Token from header:", authHeader);

    // 6. Move to next middleware/route
    next();
  } catch (err) {
    // Token is invalid or expired
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
