import express from 'express'
import {
  getUsers,
  deleteUser,
  updateUser,
  createUser,
  getUser,
} from '../controllers/users.js'

import User from '../models/User.js'
import advancedResults from '../middleware/advancedResults.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router({ mergeParams: true })
router.use(protect)
router.use(authorize('admin'))
router.route('/').get(advancedResults(User), getUsers).post(createUser)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

export default router
