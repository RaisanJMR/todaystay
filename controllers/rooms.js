import Room from '../models/Room.js'
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
    query = Room.find()
  }
  const rooms = await query
  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  })
})
export { getRooms }
