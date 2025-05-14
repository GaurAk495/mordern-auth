import express from 'express'
import 'dotenv/config';
import cors from 'cors'
import connectDb from './model/connecDB.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js'
const app = express()


const PORT = process.env.PORT || 4040

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())


app.use((req, res, next) => {
    console.log(req.url, req.method)
    next()
})

app.use('/auth', authRouter)

connectDb().then(() => {
    app.listen(PORT, () => console.log(`The Server is running on http://localhost:${PORT}`))
})

