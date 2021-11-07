import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import Review from '../models/Reviews.js'
import Hotel from '../models/Hotel.js'

// @DESC    GET all reviews
// @ROUTE   GET api/v1/reviews
// @ROUTE   GET api/v1/hotels/:hotelId/reviews
// @ACCESS  Public

const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.hotelId) {
    console.log(req.params.hotelId)
    const reviews = await Review.find({ hotel: req.params.hotelId })
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})
// @DESC    GET single review
// @ROUTE   GET api/v1/reviews/:id
// @ACCESS  Public

const getSingleReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'hotel',
    select: 'name description',
  })
  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({
    success: true,
    data: review,
  })
})
// @desc      Add review
// @route     POST /api/v1/hotels/:hotelId/reviews
// @access    Private
const addReview = asyncHandler(async (req, res, next) => {
  req.body.hotel = req.params.hotelId
  req.body.user = req.user.id
  const hotel = await Hotel.findById(req.params.hotelId)

  if (!hotel) {
    return next(
      new ErrorResponse(`No hotel with the id of ${req.params.hotelId}`, 404)
    )
  }

  const review = await Review.create(req.body)

  res.status(201).json({
    success: true,
    data: review,
  })
})
export { getSingleReview, getReviews, addReview }
