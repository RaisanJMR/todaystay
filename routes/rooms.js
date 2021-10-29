import express from 'express'
import {
 getRooms
} from '../controllers/rooms.js'

const router = express.Router({mergeParams: true})
router.route('/').get(getRooms)


export default router