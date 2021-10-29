import Hotel from '../models/Hotel.js'
import geocoder from '../utils/geocoder.js'
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

// @desc    GET hotels within a radius
// @route   GET /api/v1/hotels/:zipcode/:distance
// @access  private

const getHotelsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params
  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // CAL radius using radians
  // DIVIDE distance by radius of EARTH
  // EARTH Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963
  const hotels = await Hotel.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  })
  res.status(200).json({
    success: true,
    count: hotels.length,
    data: hotels,
  })
})
export {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelsInRadius,
}
