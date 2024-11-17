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
            enum: ['Pending', 'Approved and Payment Pending', 'Booking Rejected By Onwer'], // Enum with predefined values
            required: true,
            default: 'pending'
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        bookingDate :{
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
