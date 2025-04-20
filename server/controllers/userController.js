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
        { id: newUser._id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

    res.status(201).json({ message: "Registered successfully", token });
    }catch(err){
        res.status(500).json({ message: err.message || "Server error" });
    }
}

export const loginUser = async(req,res)=>{
    try{
        const { emailOrUsername, password } = req.body;

        const user = await User.findOne({
        $or: [
            { email: emailOrUsername },
            { username: emailOrUsername }
        ]
        });
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const passwordMatched = await bcrypt.compare(req.body.password, user.password);
        if(!passwordMatched){
            return res.status(400).json({message:"INCORRECT EMAIL OR PASSWORD"});
        }
        const token = jwt.sign({ id: user._id,username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("🔐 Token:", token); // <-- log it here
        
        return res.status(200).json({message:"Logged in successfully!",token})
    }catch(err){
        res.status(500).json({error:err})
    }
}

