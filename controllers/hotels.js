// @desc    get all hotels
// @route   GET api/v1/hotels
// @access  public

const getHotels = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: 'show all hotels' })
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

const createHotel = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'add a new hotel' })
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
