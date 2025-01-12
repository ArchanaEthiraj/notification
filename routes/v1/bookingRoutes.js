const express = require('express')
const { bookingValidate } = require('../../service/bookingSerivce')
const {
  createBooking,
  updateBooking,
  deleteBooking,
  getAllBooking,
  getByIdBooking,
  updateShopStatusAndBookingStatus
} = require('../../controller/bookingController')
const { authenticating, checkVendor } = require('../../middleware/userAuthenticate')
const router = express.Router()


// BOOKING ROUTES
router.post('/create', authenticating, checkVendor, bookingValidate, createBooking)
router.put('/update/:id', authenticating, checkVendor, bookingValidate, updateBooking)
router.delete('/delete/:id', authenticating, checkVendor, deleteBooking)
router.get('/list', authenticating, checkVendor, getAllBooking)
router.get('/detail/:id', authenticating, getByIdBooking)
router.get('/view/:id', getByIdBooking)// without authenticating
router.get('/update', updateShopStatusAndBookingStatus)

module.exports = router
