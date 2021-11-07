import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
import morgan from 'morgan'
import fileupload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import path from 'path'
import hotels from './routes/hotels.js'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'
import rooms from './routes/rooms.js'
import auth from './routes/auth.js'
import users from './routes/users.js'
import reviews from './routes/reviews.js'
import errorHandler from './middleware/error.js'

dotenv.config({ path: './config/config.env' })

// CONNECT TO DATABASE
connectDB()

const app = express()

// BODY PARSER
app.use(express.json())

// COOKIE PARSER
app.use(cookieParser())

// DEV LOGGING MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
})
app.use(limiter)
// Prevent XSS attacks
app.use(xss())
// Enable CORS
app.use(cors())
app.options('*', cors())

// Sanitize data
// app.use(mongoSanitize())
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// FILE UPLOADING
app.use(fileupload())

// SET STATIC FOLDER
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, 'public')))

// MOUNT ROUTERS
app.use('/api/v1/hotels', hotels)
app.use('/api/v1/rooms', rooms)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

app.use(errorHandler)
const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.underline
      .brightYellow.bold.underline
  )
)
