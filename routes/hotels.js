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
import { protect, authorize } from '../middleware/auth.js'
import Hotel from '../models/Hotel.js'
import advancedResults from '../middleware/advancedResults.js'
import roomRouter from './rooms.js'
import reviewRouter from './reviews.js'
const router = express.Router()

// Re-route into other resource routers
router.use('/:hotelId/rooms', roomRouter)
router.use('/:hotelId/reviews', reviewRouter)

router.route('/radius/:zipcode/:distance').get(getHotelsInRadius)
router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), hotelPhotoUpload)
router
  .route('/')
  .get(advancedResults(Hotel, 'rooms'), getHotels)
  .post(protect, authorize('publisher', 'admin'), createHotel)
router
  .route('/:id')
  .get(getHotel)
  .put(protect,authorize('publisher', 'admin'), updateHotel)
  .delete(protect,authorize('publisher', 'admin'), deleteHotel)

export default router
