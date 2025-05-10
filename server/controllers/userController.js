import User from "../model/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config(); // ✅ load env variables

export const createUser = async(req,res) =>{

    try{
    const { email,username,password } = req.body;
    if(!email || !username || !password){
        return res.status(400).json({message:"Please fill all fields"})
    }
    const user = await User.findOne({
        $or: [{ email }, { username }]
      });
    // checking for email is exist or not 
    if(user) return res.status(401).json({message:"email is already exist!"})
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
        email, 
        password: hashedPassword, 
        username 
      });

   const token = jwt.sign(
  { id: newUser._id, username: newUser.username }, // Must include username
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

    res.status(201).json({ message: "Registered successfully", token });
    }catch(err){
        res.status(500).json({ message: err.message || "Server error" });
    }
}

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