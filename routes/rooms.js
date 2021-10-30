import express from 'express'
import {
  addRoom,
  getRoom,
  getRooms,
  updateRoom,
  deleteRoom,
} from '../controllers/rooms.js'

const router = express.Router({ mergeParams: true })
router.route('/').get(getRooms).post(addRoom)
router.route('/:id').get(getRoom).put(updateRoom).delete(deleteRoom)

export default router
