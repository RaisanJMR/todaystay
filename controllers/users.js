import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import User from '../models/User.js'

// @DESC    Get all users
// @ROUTE   GET api/v1/auth/users
// @ACCESS  Private/Admin

const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @DESC    Get single user
// @ROUTE   GET api/v1/auth/users/:id
// @ACCESS  Private/Admin

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  res.status(200).json({ success: true, data: user })
})

// @DESC    Create user
// @ROUTE   POST api/v1/auth/users
// @ACCESS  Private/Admin

const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)

  res.status(201).json({ success: true, data: user })
})

// @DESC    Update user
// @ROUTE   PUT api/v1/auth/users/:id
// @ACCESS  Private/Admin

const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: user })
})

// @DESC    Delete user
// @ROUTE   DELETE api/v1/auth/users/:id
// @ACCESS  Private/Admin

const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)

  res.status(200).json({ success: true, data: {} })
})

export { getUsers, deleteUser, updateUser, createUser, getUser }
