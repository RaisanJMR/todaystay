import express from 'express'
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logOut
} from '../controllers/auth.js'
import { protect } from '../middleware/auth.js'
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logOut)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)

export default router
