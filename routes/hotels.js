import express from 'express'
import {
  getHotels,
  getHotel,
  updateHotel,
  createHotel,
  deleteHotel,
  getHotelsInRadius,
  hotelPhotoUpload,
} from '../controllers/hotels.js'
import Hotel from '../models/Hotel.js'
import advancedResults from '../middleware/advancedResults.js'
import roomRouter from './rooms.js'
const router = express.Router()

// Re-route into other resource routers
router.use('/:hotelId/rooms', roomRouter)

router.route('/radius/:zipcode/:distance').get(getHotelsInRadius)
router.route('/:id/photo').put(hotelPhotoUpload)
router.route('/').get(advancedResults(Hotel,'rooms'),getHotels).post(createHotel)
router.route('/:id').get(getHotel).put(updateHotel).delete(deleteHotel)

export default router
