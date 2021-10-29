import express from 'express'
import {
  getHotels,
  getHotel,
  updateHotel,
  createHotel,
  deleteHotel,
  getHotelsInRadius
} from '../controllers/hotels.js'

import roomRouter from './rooms.js'
const router = express.Router()

// Re-route into other resource routers
router.use('/:hotelId/rooms',roomRouter)

router.route('/radius/:zipcode/:distance').get(getHotelsInRadius)
router.route('/').get(getHotels).post(createHotel)
router.route('/:id').get(getHotel).put(updateHotel).delete(deleteHotel)

export default router
