import express from 'express'
import { login, signup, logout, isAcVerified, isUserLoggedIn, sendVerifyEmail, verifyOtp, sendResetOTP, verifyResetOTP } from '../controllers/authController.js'
import validateToken from '../middleware/tokenValidation.js'


const authRouter = express.Router()

authRouter.post('/signup', signup);

authRouter.post('/login', login);

authRouter.get('/logout', validateToken, logout)

authRouter.get('/isAccountVerified', validateToken, isAcVerified);

authRouter.get('/isUserLoggedIn', validateToken, isUserLoggedIn)

authRouter.get('/verify-email', validateToken, sendVerifyEmail)

authRouter.post('/verify-email', validateToken, verifyOtp)

authRouter.post('/reset-password', sendResetOTP)

authRouter.post('/verify-reset-password', verifyResetOTP)

export default authRouter