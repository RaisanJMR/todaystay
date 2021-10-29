import Hotel from '../models/Hotel.js'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
// @desc    get all hotels
// @route   GET api/v1/hotels
// @access  public

const getHotels = asyncHandler(async (req, res, next) => {
  const hotels = await Hotel.find()
  res.status(200).json({ success: true, count: hotels.length, data: hotels })
})

// @desc    get single hotels
// @route   GET api/v1/hotels/:id
// @access  public

const getHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id)
  if (!hotel) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: hotel })
})

// @desc    create new hotels
// @route   POST api/v1/hotels
// @access  private

const createHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.create(req.body)
  res.status(201).json({
    success: true,
    data: hotel,
  })
})

// @desc    update hotels
// @route   PUT api/v1/hotels/:id
// @access  private

const updateHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!hotel) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: hotel })
})

// @desc    delete hotels
// @route   DELETE api/v1/hotels/:id
// @access  private

const deleteHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id)
  if (!hotel) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: {} })
})

export { getHotels, getHotel, createHotel, updateHotel, deleteHotel }
