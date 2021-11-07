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
// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    )
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this review`,
        401
      )
    )
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  review.save()

  res.status(200).json({
    success: true,
    data: review,
  })
})
// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
export { getSingleReview, getReviews, addReview, updateReview,deleteReview }
