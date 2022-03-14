import express from 'express'
import {
  addRoom,
  getRoom,
  getRooms,
  updateRoom,
  deleteRoom,
} from '../controllers/rooms.js'

import Room from '../models/Room.js'
import advancedResults from '../middleware/advancedResults.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router({ mergeParams: true })
router.route('/').get(advancedResults(Room, {path: 'hotel', select: 'name description'}),getRooms).post(protect, authorize('publisher', 'admin'), addRoom)
router
  .route('/:id')
  .get(getRoom)
  .put(protect, authorize('publisher', 'admin'), updateRoom)
  .delete(protect, authorize('publisher', 'admin'), deleteRoom)

export default router
