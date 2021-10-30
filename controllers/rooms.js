import Room from '../models/Room.js'
import Hotel from '../models/Hotel.js'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'

// @desc    get all rooms
// @route   GET api/v1/hotels
// @route   GET api/v1/hotels/:hotelId/rooms
// @access  public

const getRooms = asyncHandler(async (req, res, next) => {
  let query
  if (req.params.hotelId) {
    query = Room.find({ hotel: req.params.hotelId })
  } else {
    query = Room.find().populate({
      path: 'hotel',
      select: 'name description',
    })
  }
  const rooms = await query
  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  })
})

// @desc    get single room
// @route   GET api/v1/rooms/:id
// @access  public

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
// @desc    Add room
// @route   POST api/v1/hotels/:hotelId/rooms
// @access  private

const addRoom = asyncHandler(async (req, res, next) => {
  req.body.hotel = req.params.hotelId
  const hotel = await Hotel.findById(req.params.hotelId)
  if (!hotel) {
    return next(
      new ErrorResponse(`No hotel with the id of ${req.params.hotelId}`, 404)
    )
  }
  const room = await Room.create(req.body)
  res.status(200).json({
    success: true,
    data: room,
  })
})
// @desc    Update room
// @route   PUT api/v1/rooms/:id
// @access  private

const updateRoom = asyncHandler(async (req, res, next) => {
  let room = await Room.findById(req.params.id)
  if (!room) {
    return next(
      new ErrorResponse(`No room with the id of ${req.params.id}`, 404)
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
// @desc    Delete room
// @route   DELETE api/v1/rooms/:id
// @access  private

const deleteRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id)
  if (!room) {
    return next(
      new ErrorResponse(`No room with the id of ${req.params.id}`, 404)
    )
  }
 await room.remove()
  res.status(200).json({
    success: true,
    data: {}
  })
})
export { getRooms, getRoom, addRoom, updateRoom,deleteRoom }
