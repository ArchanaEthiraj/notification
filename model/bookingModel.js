const mongoose = require('mongoose')

const booking = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.ObjectId,
      require: true
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      require: true
    },
    shopOwnerId: {
      type: mongoose.Schema.ObjectId,
      require: true
    },
    bookingStatus: {
      type: String,
      enum: [
        'Pending',
        'Approved and Verification Pending',
        'Vendor Submitted the Document',
        'Booking Rejected By Owner',
        'Document Rejected By Owner and Re-Submit the Document',
        'Vendor Re-Submitted the Document',
        'Document Verified and Payment Pending',
        'Payment Settled and Shop Booked'
      ], // Enum with predefined values
      required: true,
      default: 'Pending'
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    bookingDate: {
      type: Date,
      default: new Date()
    }
  },
  {
    timestamps: true
  }
)

const Booking = mongoose.model('Booking', booking)

module.exports = Booking
