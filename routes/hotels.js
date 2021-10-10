import express from 'express'
import {
  getHotels,
  getHotel,
  updateHotel,
  createHotel,
  deleteHotel,
} from '../controllers/hotels.js'
const router = express.Router()

router.route('/').get(getHotels).post(createHotel)
router.route('/:id').get(getHotel).put(updateHotel).delete(deleteHotel)

export default router
