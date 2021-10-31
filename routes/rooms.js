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

const router = express.Router({ mergeParams: true })
router
  .route('/')
  .get(
    advancedResults(Room, {
      path: 'hotel',
      select: 'name description',
    }),
    getRooms
  )
  .post(addRoom)
router.route('/:id').get(getRoom).put(updateRoom).delete(deleteRoom)

export default router
