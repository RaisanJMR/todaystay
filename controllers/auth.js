import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import User from '../models/User.js'

// @desc    Register user
// @route   POST api/v1/auth/register
// @access  public

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body
  const user = await User.create({
    name,
    email,
    password,
    role,
  })
  // Create token
  const token = user.getSignedJwtToken()
  res.status(200).json({
    success: true,
    token: token,
  })
})

// @desc    Login user
// @route   POST api/v1/auth/register
// @access  public

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400))
  }
  // Check for user
  const user = await User.findOne({ email: email }).select('+password')
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  // Create token
  const token = user.getSignedJwtToken()
  res.status(200).json({
    success: true,
    token: token,
  })
})
export { login, register }
