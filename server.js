import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
import morgan from 'morgan'


import hotels from './routes/hotels.js'
import rooms from './routes/rooms.js'
import errorHandler from './middleware/error.js'

dotenv.config({ path: './config/config.env' })

// Connect to database
connectDB()

const app = express()

app.use(cors());
app.options('*', cors());

// Body Parser
app.use(express.json())


// DEV LOGGING MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// MOUNT ROUTERS
app.use('/api/v1/hotels', hotels)
app.use('/api/v1/rooms', rooms)
app.use(errorHandler)
const PORT = process.env.PORT || 5001

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.underline
      .brightYellow.bold.underline
  )
)
