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
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
})
// Static method to get average of rooms
RoomSchema.statics.getAverageCost = async function (hotelId) {
  console.log('calculating average cost....'.blue)
  const obj = await this.aggregate([
    {
      $match: { hotel: hotelId },
    },
    {
      $group: {
        _id: '$hotel',
        averageCost: { $avg: '$dailyrent' },
      },
    },
  ])
  try {
    await this.model('Hotel').findByIdAndUpdate(hotelId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    })
  } catch (err) {
    console.error(err)
  }
}

// Call getAverageCost after save
RoomSchema.post('save', function () {
  this.constructor.getAverageCost(this.hotel)
})
// Call getAverageCost before remove
RoomSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.hotel)
})

// create MODEL from this SCHEMA
const Room = mongoose.model('Room', RoomSchema)
export default Room
