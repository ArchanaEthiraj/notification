const moment = require('moment')
const Booking = require('../model/bookingModel')
const { shopgetByIdRes, shopUpdateRes } = require('../service/shopService')
const { usergetByIdRes } = require('../service/userService')
const { sendEmail } = require('../utils/utils')

const createBooking = async (req, res, next) => {
  try {
    const { shopId, shopOwnerId } = req.body
    let bookingDate = moment().format('YYYY-MM-DD')
    let userId = req.user.id
    let bookingRes = await Booking.findOne({
      shopId,
      userId,
      shopOwnerId,
      bookingStatus: 'pending',
      isDeleted: false
    })
    // console.log('bookingStatus', bookingRes)

    if (bookingRes) {
      return res.status(500).json({ message: 'Shop Already Booked' })
    }
    const bookingCreate = new Booking({
      shopId,
      userId,
      shopOwnerId,
      bookingDate: bookingDate,
      bookingStatus: 'Pending'
    })

    let values = await bookingCreate.save()
    if (values) {
      // vendar and shop onwer mail functions

      let confirm_link = `http://localhost:4001/api/v1/booking/update?confirm=1&shopId=${shopId}&userId=${userId}&shopOwnerId=${shopOwnerId}`
      let rejected_link = `http://localhost:4001/api/v1/booking/update?confirm=0&shopId=${shopId}&userId=${userId}&shopOwnerId=${shopOwnerId}`
      // console.log('req.headers.authorization---------->', req.headers.authorization.split(' ')[1])
      let shopOwnerRes = await usergetByIdRes(shopOwnerId, req.headers.authorization.split(' ')[1])
      let vendorRes = await usergetByIdRes(userId, req.headers.authorization.split(' ')[1])
      let shopRes = await shopgetByIdRes(shopId, req.headers.authorization.split(' ')[1])

      // in html button link want above there
      let content = {
        from: vendorRes.userEmail,
        to: shopOwnerRes.userEmail,
        htmlContent: `
        <h1>Hi ${shopOwnerRes.userName},</h1>
        <p>Vendor Name: ${vendorRes.userName}</p>
        <p>Shop Name: ${shopRes.shopName}</p>
        <p>Shop Price: ${shopRes.price}</p>
        <p>Vendor has requested to book the shop. Do you want to accept the Deal?</p>
        <span>
        <a href="${confirm_link}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none; border-radius: 5px;">Confirm</a>
        <a href="${rejected_link}" style="padding: 10px 20px; background-color: red; color: white; text-decoration: none; border-radius: 5px; margin-left: 10px;">Reject</a>
        </span>
        `,
        subject: 'Shop Booking Request'
      }
      console.log('content', content)
      await sendEmail(content)
      return res.status(200).json({ message: 'Booking Create Successfully!' })
    } else {
      return res.status(500).json({ message: 'Unable to Create Booking' })
    }
  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ message: 'Unable to Create Booking', error: error })
  }
}

const updateBooking = async (req, res) => {
  try {
    let id = req.params.id
    if (!id) {
      return res.status(400).json({ message: 'Id Required' })
    }
    let updateBooking = req.body
    await Booking.findByIdAndUpdate({ _id: id }, updateBooking)
    return res.status(200).json({ message: 'Updated Successfully!' })
  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ message: 'Error while Updating', error: error })
  }
}

const getByIdBooking = async (req, res) => {
  try {
    let id = req.params.id
    if (!id) {
      return res.status(400).json({ message: 'Id Required' })
    }
    let data = await Booking.findById({ _id: id })
    data = JSON.parse(JSON.stringify(data)) // get raw data - dataValues
    let shopRes = await shopgetByIdRes(data.shopId)
    let vendorRes = await usergetByIdRes(data.userId)
    let shopOwnerRes = await usergetByIdRes(data.shopOwnerId)
    data = {
      ...data,
      shop_details: { ...shopRes },
      vendor_details: { ...vendorRes },
      shop_owner_detail: { ...shopOwnerRes }
    }
    return res.status(200).json({ message: 'Booking Data', data: data })
  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ message: 'Error', error: error })
  }
}

const deleteBooking = async (req, res) => {
  try {
    let id = req.params.id
    if (!id) {
      return res.status(400).json({ message: 'Id Required' })
    }
    let updateShop = { isDeleted: true }
    await Booking.findByIdAndUpdate({ _id: id }, updateShop)
    res.status(200).json({ message: 'Deleted Successfully!' })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ message: 'Error', error: error })
  }
}

const getAllBooking = async (req, res) => {
  try {
    let userId = req.user.id
    let bookingRes = await Booking.find({ userId: userId, isDeleted: false })
    bookingRes = JSON.parse(JSON.stringify(bookingRes))
    let array = []
    for (let i = 0; i < bookingRes.length; i++) {
      const element = bookingRes[i]
      let shopRes = await shopgetByIdRes(element.shopId)
      let vendorRes = await usergetByIdRes(element.userId)
      let shopOwnerRes = await usergetByIdRes(element.shopOwnerId)
      array.push({
        ...element,
        shop_details: { ...shopRes },
        vendor_details: { ...vendorRes },
        shop_owner_detail: { ...shopOwnerRes }
      })
    }
    return res.status(200).json({ message: 'Listed Successfully!', data: array })
  } catch (error) {
    return res.status(500).json({ message: 'Error', error: error })
  }
}

const updateShopStatusAndBookingStatus = async (req, res, next) => {
  try {
    // default set the bookingstatus pendingByowner

    let confirmStatus = req.query.confirm
    console.log('confirmStatus', confirmStatus)
    const { shopId, userId, shopOwnerId } = req.query
    console.log('first', shopId, userId, shopOwnerId)
    if (confirmStatus == 1) {
      let shopQuery = await shopUpdateRes(
        req.query.shopId,
        // req.headers.authorization.split(' ')[1],
        null,
        { isActive: false }
      )
      let bookQuery = await Booking.findOneAndUpdate(
        {
          userId: req.query.userId,
          shopId: req.query.shopId
        },
        { bookingStatus: 'Approved and Verification Pending' }
      )
      let shopOwnerRes = await usergetByIdRes(shopOwnerId, null)
      let vendorRes = await usergetByIdRes(userId, null)
      let shopRes = await shopgetByIdRes(shopId, null)
      console.log('shopOwnerRes ---->', shopOwnerRes)
      console.log('vendorRes ---->', vendorRes)
      console.log('shopRes ---->', shopRes)
      // in html button link want above there
      let content = {
        from: shopOwnerRes?.userEmail,
        to: vendorRes?.userEmail,
        htmlContent: `
        <h1>Hi ${vendorRes?.userName},</h1>
        <p>Shop Owner Name: ${shopOwnerRes?.userName}</p>
        <p>Shop Name: ${shopRes?.shopName}</p>
        <p>Shop Price: ${shopRes?.price}</p>
        <p>${shopOwnerRes?.userName} has Accepted the request. Kindly submit your document for verification.</p>
        `,
        subject: 'Booking Accepted'
      }
      console.log('content', content)
      await sendEmail(content)
      console.log('req.query ---->', req.query)
      console.log('shopQuery ---->', shopQuery)
      console.log('bookQuery ---->', bookQuery)
      return res.status(200).json({ message: 'Approved Successfully!' })
    } else if (confirmStatus == 0) {
      let shopQuery = await shopUpdateRes(
        req.query.shopId,
        req.headers.authorization.split(' ')[1],
        { isActive: true }
      )
      await Booking.findOneAndUpdate(
        {
          userId: req.query.userId,
          shopId: req.query.shopId
        },
        { bookingStatus: 'Booking Rejected By Owner' }
      )
      let shopOwnerRes = await usergetByIdRes(shopOwnerId, req.headers.authorization.split(' ')[1])
      let vendorRes = await usergetByIdRes(userId, req.headers.authorization.split(' ')[1])
      let shopRes = await shopgetByIdRes(shopId, req.headers.authorization.split(' ')[1])

      // in html button link want above there
      let content = {
        from: shopOwnerRes.userEmail,
        to: vendorRes.userEmail,
        htmlContent: `
         <h1>Hi ${shopOwnerRes.userName},</h1>
        <p>Vendor Name: ${vendorRes.userName}</p>
        <p>Shop Name: ${shopRes.shopName}</p>
        <p>Shop Price: ${shopRes.price}</p>
        <p>Shop Owner has Rejected the request. Thank you for Requesting.</p>
        `,
        subject: 'Booking Rejected'
      }
      console.log('content', content)
      await sendEmail(content)
      return res.status(200).json({ message: 'Rejected Successfully!' })
    }
  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ message: 'Error', error: error })
  }
}

module.exports = {
  createBooking,
  updateBooking,
  getByIdBooking,
  deleteBooking,
  getAllBooking,
  updateShopStatusAndBookingStatus
}
