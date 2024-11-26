const mongoose = require('mongoose')

// UPLOAD DOCUMENT SCHEMA
const userDocument = new mongoose.Schema(
  {
    docName: {
      type: String,
      require: true
    },
    docType: {
      type: String,
      require: true
    },
    status: {
      type: String,
      require: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const UserDocument = mongoose.model('UserDocument', userDocument)

module.exports = UserDocument
