import express from 'express'
import { protectRoute } from '../middlewares/protectRoute.js';
import { getMessagesById, getUsers, sendMessage } from '../controllers/message.controller.js';
const router=express.Router()
router.get('/users',protectRoute,getUsers)
router.get('/:id',protectRoute,getMessagesById)
router.post('/send/:id',protectRoute,sendMessage)
export default router;