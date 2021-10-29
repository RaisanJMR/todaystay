import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
// import logger from './middleware/logger.js'
import morgan from 'morgan'
// ROUTE FILES
import hotels from './routes/hotels.js'
import errorHandler from './middleware/error.js'
// LOAD .env variables
dotenv.config({ path: './config/config.env' })

// Connect to database
connectDB()

const app = express()

// Body Parser
app.use(express.json())

// app.use(logger)
// DEV LOGGING MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// MOUNT ROUTERS
app.use('/api/v1/hotels', hotels)
app.use(errorHandler)
const PORT = process.env.PORT || 5001

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.underline
      .brightYellow.bold.underline
  )
)

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`.underline.brightRed.bold)
//   // Close server & exit process
//   server.close(() => process.exit(1))
// })
