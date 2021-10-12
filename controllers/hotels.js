import Hotel from '../models/Hotel.js'

// @desc    get all hotels
// @route   GET api/v1/hotels
// @access  public

const getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find()
    res.status(200).json({ success: true, data: hotels })
  } catch (err) {
    res.status(400).status({ success: false })
  }
}

// @desc    get single hotels
// @route   GET api/v1/hotels/:id
// @access  public

const getHotel = (req, res, next) => {
  res.status(200).json({ success: true, msg: `get hotel ${req.params.id}` })
}

// @desc    create new hotels
// @route   POST api/v1/hotels
// @access  private

const createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body)
    res.status(201).json({
      success: true,
      data: hotel,
    })
  } catch (err) {
    res.status(500).status({ success: false })
  }
}

// @desc    update hotels
// @route   PUT api/v1/hotels/:id
// @access  private

const updateHotel = (req, res, next) => {
  res.status(200).json({ success: true, msg: `update hotel ${req.params.id}` })
}

// @desc    delete hotels
// @route   DELETE api/v1/hotels/:id
// @access  private

const deleteHotel = (req, res, next) => {
  res.status(200).json({ success: true, msg: `delete hotel ${req.params.id}` })
}

export { getHotels, getHotel, createHotel, updateHotel, deleteHotel }
