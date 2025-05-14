import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAcVerified: { type: Boolean, default: false },
    verifiyOtp: { type: String, default: '' },
    verifyOtpExpirtat: { type: Number, default: 0 },
    resetPwdOTP: { type: Number, default: '' },
    resetOtpVerifyat: { type: Number, default: 0 },
})

const UserModel = mongoose.model('user', userSchema)
export default UserModel