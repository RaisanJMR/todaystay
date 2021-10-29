import mongoose from 'mongoose'


const RoomSchema = new mongoose.Schema({
  roomtype: {
    type: String,
    trim: true,
    required: [true, 'Please add a room type'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  area: {
    type: Number,
    required: [true, 'Please add room area'],
  },
  dailyrent: {
    type: Number,
    required: [true, 'Please add daily rent'],
  },
  star: {
    type: String,
    required: [true, 'Please add star'],
    enum: ['3 star', '4 star', '5 star'],
  },
  ac: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hotel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Hotel',
      required: true
  }
})
// create MODEL from this SCHEMA
const Room = mongoose.model('Room', RoomSchema)
export default Room
