import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/util.js';
import cloudinary from '../lib/cloudinary.js';
export const signUp=async(req,res)=>{
    const {email,fullName,password}=req.body;
    try{
    if(!email || !fullName || !password){
        return res.status(400).json({message:"All fields are required"})
    }
    if (password.length<6){
        return res.status(400).json({message:'Password must have 6 characters'})
    }
    const user=await User.findOne({email})
    if (user){
        return res.status(401).json({message:'User already exits'})
    }
    const salt= await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    const newUser=new User({
        fullName,
        email,
        password:hashedPassword,
    })
    if (newUser){
        generateToken(newUser._id,res);
        await newUser.save()
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profile_pic:newUser.profile_pic
        })
    }else{
        res.status(500).json({message:'internal server error'})
    }
}catch(error){
    console.log('error in signUp')
    res.status(500).json({message:'internal server error'})
}
}
export const login=async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:'invalid credentials'})
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:'invalid credentials'})
        }
        generateToken(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profile_pic:user.profile_pic
        })
    }catch(error){
        console.log('error in login:',error)
        res.status(500).json({message:"internal server error"})
    }

}
export const logout=async(req,res)=>{
   try{
    res.cookie('jwt','',{maxAge:0})
    res.status(200).json({message:'logged out successfully'})
   }catch(error){
    res.status(500).json({message:'error in logging out'})
   }
}
export const uploadProfile=async(req,res)=>{
    try{
       const {profile_pic}=req.body
       const userId=req.User._id
       if(!profile_pic){
        return res.status(400).json({message:'profile pic required'})
       }
       const updateResponse=await cloudinary.uploader.upload(profile_pic)
       const updatedUser=await User.findByIdAndUpdate(userId,{profile_pic:updateResponse.secure_url},{new:true})
       res.status(200).json(updatedUser)
    }catch(error){
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}
export const checkAuth=async(req,res)=>{
    try{
        res.status(200).json(req.User)
    }catch(error){
        console.log('error in Auth routes:',error)
        res.status(400).json({message:'Authentication failed'})
    }
}