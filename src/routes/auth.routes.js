import express from 'express'
import { checkAuth, login, logout, signUp, uploadProfile } from '../controllers/auth.contoller.js'
import { protectRoute } from '../middlewares/protectRoute.js'
const router=express.Router()
router.post('/signup',signUp)
router.post('/login',login)
router.post('/logout',logout)
router.put('/update_profile',protectRoute,uploadProfile)
router.get('/check',protectRoute,checkAuth)
export default router