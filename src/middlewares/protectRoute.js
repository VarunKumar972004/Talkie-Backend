import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
export const protectRoute=async(req,res,next)=>{
    try{
    const token=req.cookies.jwt;
    console.log(token)
    if(!token){
        return res.status(400).json({message:"No token Provided"})
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded){
        return res.status(400).json({message:'token mismatch'})
    }
    const user=await User.findById(decoded.User_id).select('-password')
    if(!user){
        return res.status(400).json({message:'User not found'})
    }
    req.User=user;
    next()
}catch(error){
    console.log('error occured in protect route:',error)
    res.status(500).json({message:'error in protect Route'})
}
}