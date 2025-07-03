import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import cloudinary from '../lib/cloudinary.js'
import { getRecieverSokcetId,io } from "../lib/socket.js"
export const getUsers=async(req,res)=>{
    const userId=req.User._id
    try{
      const users=await User.find({_id:{$ne:userId}}).select('-password')
      res.status(200).json(users)
    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}  
export const getMessagesById=async(req,res)=>{
    try{
    const {id:userToChatId}=req.params;
    const myId=req.User._id;
    const messages=await Message.find({
        $or:[
            {senderId:myId,recieverId:userToChatId},
            {senderId:userToChatId,recieverId:myId}
        ]
    })
    res.status(200).json(messages)
}catch(error){
    console.log(error)
    res.status(500).json({message:'Internal server error'})
}
}
export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body
        const {id:recieverId}=req.params
        const senderId=req.User._id
        let image_Url;
        if(image){
            const cloudResponse=await cloudinary.uploader.upload(image)
            image_Url=cloudResponse.secure_url;
        }
        const newMessage=new Message({
            senderId,
            recieverId,
            text,
            Image:image_Url
        })
        await newMessage.save()
        //realtime implementation is pending here
        const recieverSocketId=getRecieverSokcetId(recieverId)
        if(recieverSocketId){
            io.to(recieverSocketId).emit('newMessage',newMessage)
        }
        res.status(200).json(newMessage)

    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}