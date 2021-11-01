import Hotel from '../models/Hotel.js'
import geocoder from '../utils/geocoder.js'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import path from 'path'

// @DESC   GET all hotels
// @ROUTE   GET api/v1/hotels
// @ACCESS  Public

const getHotels = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})
// @DESC   GET single hotel
// @ROUTE   GET api/v1/hotels/:id
// @ACCESS  Public

const getHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id)
  if (!hotel) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: hotel })
})

// @DESC   Create new hotel
// @ROUTE   POST api/v1/hotels
// @ACCESS  Private

const createHotel = asyncHandler(async (req, res, next) => {
  // Add user to request body
  req.body.user = req.user.id
  // Check for published hotel
  const publishedHotel = await Hotel.findOne({ user: req.user.id })
  // If user is not admin, they can only add one hotel
  if (publishedHotel && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a resource`,
        400
      )
    )
  }
  const hotel = await Hotel.create(req.body)
  res.status(201).json({
    success: true,
    data: hotel,
  })
})

// @DESC   Update hotel
// @ROUTE   PUT api/v1/hotels/:id
// @ACCESS  Private

const updateHotel = asyncHandler(async (req, res, next) => {
  let hotel = await Hotel.findById(req.params.id)
  if (!hotel) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    )
  }
  // Make sure user is hotel owner
  if (hotel.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to update this resource`,
        401
      )
    )
  }
  hotel = await Hotel.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({ success: true, data: hotel })
})

// @DESC   Delete hotel
// @ROUTE   DELETE api/v1/hotels/:id
// @ACCESS  Private

const deleteHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id)
  if (!hotel) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    )
  }
  // Make sure user is hotel owner
  if (hotel.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this resource`,
        401
      )
    )
  }
  hotel.remove()
  res.status(200).json({ success: true, data: {} })
})

// @DESC   GET hotels within a radius
// @ROUTE   GET /api/v1/hotels/:zipcode/:distance
// @ACCESS  Private

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

// @DESC   Upload Photo for hotel
// @ROUTE   PUT api/v1/hotels/:id/photo
// @ACCESS  Private

const hotelPhotoUpload = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id)
  if (!hotel) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    )
  }
  // Make sure user is hotel owner
  if (hotel.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.params.id} is not authorized to delete this resource`,
        401
      )
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
