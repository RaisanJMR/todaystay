import express from 'express'
import {
  getReviews,
  getSingleReview,
  addReview,
} from '../controllers/reviews.js'

import Review from '../models/Reviews.js'
const router = express.Router({ mergeParams: true })
import advancedResults from '../middleware/advancedResults.js'
import { protect, authorize } from '../middleware/auth.js'

router.route('/').get(advancedResults(Review, {path: 'hotel',select: 'name description'}),getReviews).post(protect, authorize('user', 'admin'), addReview)
router.route('/:id').get(getSingleReview)
export default router
