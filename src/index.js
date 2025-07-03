import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { app,io,server } from './lib/socket.js'
dotenv.config()

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(cookieParser())
app.use(cors({
    origin:['http://localhost:5173','https://talkie-a-real-time-chat-application.vercel.app'],
    credentials:true
}))
const Port=process.env.PORT
app.get('/',(req,res)=>{
    res.send('Hello World!')
})
app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)
server.listen(Port,()=>{
    console.log('Server is running... on:',Port)
    connectDB()
})