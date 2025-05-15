import express from 'express'
import 'dotenv/config';
import cors from 'cors'
import connectDb from './model/connecDB.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js'
const app = express()

const PORT = process.env.PORT || 4000

console.log(process.env.FRONT_URL)
app.use(cors({
    origin: process.env.FRONT_URL,
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    console.log(req.url, req.method)
    next()
})

app.use('/auth', authRouter)

app.use((err, req, res, next) => {
    res.json({ success: false, message: 'Page Not Found' })
})

connectDb().then(() => {
    app.listen(PORT, () => console.log(`Server running on ${process.env.BACKEND_URL}:${PORT}`))
})
