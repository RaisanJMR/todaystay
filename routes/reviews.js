import express from 'express'
import { getReviews, getSingleReview } from '../controllers/reviews.js'

import Review from '../models/Reviews.js'
import advancedResults from '../middleware/advancedResults.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router({ mergeParams: true })
router.route('/').get(
  advancedResults(Review, {
    path: 'hotel',
    select: 'name description',
  }),
  getReviews
)
router.route('/:id').get(getSingleReview)
export default router
