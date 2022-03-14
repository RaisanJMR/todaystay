import Room from '../models/Room.js'
import Hotel from '../models/Hotel.js'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'

// @DESC    GET all rooms
// @ROUTE   GET api/v1/hotels
// @ROUTE   GET api/v1/hotels/:hotelId/rooms
// @ACCESS  Public

const getRooms = asyncHandler(async (req, res, next) => {
  if (req.params.hotelId) {
    const rooms = await Room.find({ hotel: req.params.hotelId })
    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @DESC    GET single room
// @ROUTE   GET api/v1/rooms/:id
// @ACCESS  Public

const getRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id).populate({
    path: 'hotel',
    select: 'name description',
  })
  if (!room) {
    return next(
      new ErrorResponse(`No room with the id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({
    success: true,
    data: room,
  })
})

// @DESC    Add room
// @ROUTE   POST api/v1/hotels/:hotelId/rooms
// @ACCESS  Private

const addRoom = asyncHandler(async (req, res, next) => {
  req.body.hotel = req.params.hotelId
  req.body.user = req.user.id
  const hotel = await Hotel.findById(req.params.hotelId)
  if (!hotel) {
    return next(
      new ErrorResponse(`No hotel with the id of ${req.params.hotelId}`, 404)
    )
  }
  // Make sure user is hotel owner
  if (hotel.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorized to add a room to hotel ${hotel._id}`,
        401
      )
    )
  }
  const room = await Room.create(req.body)
  res.status(200).json({
    success: true,
    data: room,
  })
})

// @DESC    Update room
// @ROUTE   PUT api/v1/rooms/:id
// @ACCESS  Private

const updateRoom = asyncHandler(async (req, res, next) => {
  let room = await Room.findById(req.params.id)
  if (!room) {
    return next(
      new ErrorResponse(`No room with the id of ${req.params.id}`, 404)
    )
  }
    // Make sure user is room owner
    if (room.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `user ${req.user.id} is not authorized to update room ${room._id}`,
          401
        )
      )
    }
  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    success: true,
    data: room,
  })
})

// @DESC    Delete room
// @ROUTE   DELETE api/v1/rooms/:id
// @ACCESS  Private

const deleteRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id)
  if (!room) {
    return next(
      new ErrorResponse(`No room with the id of ${req.params.id}`, 404)
    )
  }
    // Make sure user is hotel owner
    if (room.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `user ${req.user.id} is not authorized to delete room ${room._id}`,
          401
        )
      )
    }
  await room.remove()
  res.status(200).json({
    success: true,
    data: {},
  })
})

export { getRooms, getRoom, addRoom, updateRoom, deleteRoom }
