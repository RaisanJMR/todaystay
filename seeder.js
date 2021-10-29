import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import colors from 'colors'
import dotenv from 'dotenv'
import Hotel from './models/Hotel.js'
import connectDB from './config/db.js'

// Load env vars
dotenv.config({ path: './config/config.env' })

// connect to DB
connectDB()


// Read JSON files
const __dirname = path.resolve()
const hotels = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/hotels.json`, 'utf-8')
)

 // import to db
const importData = async () => {
  try {
    await Hotel.create(hotels)
    console.log('DATA IMPORTED..'.green.inverse)
    process.exit()
  } catch (err) {
    console.log(err)
  }
}
// Delete data
const deleteData = async () => {
  try {
    await Hotel.deleteMany()
    console.log('DATA DESTROYED..'.red.inverse)
    process.exit()
  } catch (err) {
    console.log(err)
  }
}
if (process.argv[2] === '-i') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}
