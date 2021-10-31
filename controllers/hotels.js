import Hotel from '../models/Hotel.js'
import geocoder from '../utils/geocoder.js'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import path from 'path'

// @desc    GET all hotels
// @route   GET api/v1/hotels
// @access  public

const getHotels = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    GET single hotel
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

// @desc    Create new hotel
// @route   POST api/v1/hotels
// @access  private

const createHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.create(req.body)
  res.status(201).json({
    success: true,
    data: hotel,
  })
})

// @desc    Update hotel
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

// @desc    Delete hotel
// @route   DELETE api/v1/hotels/:id
// @access  private

const deleteHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id)
  if (!hotel) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    )
  }
  hotel.remove()
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

// @desc    Upload Photo for hotel
// @route   PUT api/v1/hotels/:id/photo
// @access  private

const hotelPhotoUpload = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id)
  if (!hotel) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    )
  }
  if (!req.files) {
    return next(new ErrorResponse(`please upload a file`, 400))
  }
  const file = req.files.file
  // Make sure image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`please upload an image file`, 400))
  }
  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    )
  }
  // Create custom file name
  file.name = `photo_${hotel._id}${path.parse(file.name).ext}`
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err)
      return next(new ErrorResponse(`problem with file upload`, 500))
    }
  })
  await Hotel.findByIdAndUpdate(req.params.id, { photo: file.name })
  res.status(200).json({
    success: true,
    data: file.name,
  })
})
export {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelsInRadius,
  hotelPhotoUpload,
}
