import express from 'express'
import { login, signup, isAuth, sendVerifyEmail, verifyOtp, sendResetOTP, verifyResetOTP } from '../controllers/authController.js'
import validateToken from '../middleware/tokenValidation.js'


const authRouter = express.Router()

authRouter.post('/signup', signup);

authRouter.post('/login', login);

authRouter.get('/isAuthenticate', validateToken, isAuth);

authRouter.get('/verify-email', validateToken, sendVerifyEmail)

authRouter.post('/verify-email', validateToken, verifyOtp)

authRouter.post('/reset-password', sendResetOTP)

authRouter.post('/verify-reset-otp', validateToken, verifyResetOTP)

export default authRouter