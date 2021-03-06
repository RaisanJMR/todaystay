import mongoose from 'mongoose'
import slugify from 'slugify'
import geocoder from '../utils/geocoder.js'

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters'],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    frontOffice_jobs: {
      type: [String],
      required: true,
      enum: [
        'Hotel Porter',
        'Front Desk Employee',
        'Front Desk Manager',
        'Maintenance & Cleaning',
        'Hotel Concierge',
        'Housekeeping Employee',
        'Housekeeping Manager',
      ],
    },
    management_jobs: {
      type: [String],
      required: true,
      enum: [
        'Hotel / General Manager',
        'Marketing Manager',
        'Sales Manager',
        'Revenue Manager',
        'Accounting Manager',
        'Purchase Manager',
        'Human Resource Manager',
        'IT Manager',
      ],
    },
    foodandBeverage_roles: {
      type: [String],
      required: true,
      enum: [
        'Waiting Staff',
        'Restaurant Manager',
        'Kitchen Staff',
        'Kitchen Manager',
        'Head Chef',
        'Room Service',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10'],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    businessFacilities: {
      type: Boolean,
      default: false,
    },
    internet: {
      type: Boolean,
      default: false,
    },
    activities: {
      type: Boolean,
      default: false,
    },
    publicTransit: {
      type: Boolean,
      default: false,
    },
    outdoorPool: {
      type: Boolean,
      default: false,
    },
    petFriendly: {
      type: Boolean,
      default: false,
    },
    garden: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Create hotel slug from the name
HotelSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// Geocode location field
HotelSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address)
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  }

  // Do not save address in DB
  this.address = undefined
  next()
})

// Cascade delete rooms when a hotel is deleted
HotelSchema.pre('remove', async function (next) {
  console.log(`Rooms removed from hotel ${this._id}`)
  await this.model('Room').deleteMany({ hotel: this._id })
  next()
})

// Reverse populate with virtuals
HotelSchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'hotel',
  justOne: false,
})

// create MODEL from this SCHEMA
const Hotel = mongoose.model('Hotel', HotelSchema)
export default Hotel
