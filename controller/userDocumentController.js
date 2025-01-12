const Booking = require('../model/bookingModel')
const userDocument = require('../model/userDocumentModel')
const { shopgetByIdRes } = require('../service/shopService')
const { usergetByIdRes } = require('../service/userService')
const { sendEmail } = require('../utils/utils')

// UPLOAD DOCUMENT
const createDocument = async (req, res, next) => {
  try {
    const { bookingId } = req.body
    let userId = req.user.id
    let documentRes = await userDocument.findOne({
      bookingId,
      status: 'Pending'
    })

    if (documentRes) {
      return res.status(500).json({ message: 'Already Submitted the Document' })
    }
    const documentCreate = new userDocument({
      docName: req.file.filename,
      docType: req.file.filename,
      status: 'Pending',
      userId,
      bookingId
    })
    let values = await documentCreate.save()
    if (values) {
      // vendar and shop onwer mail functions
      let bookingRes = await Booking.findOne({
        _id: bookingId
      })
      let shopId = bookingRes?.shopId || 0
      let shopOwnerId = bookingRes?.shopOwnerId || 0
      let confirm_link = `http://localhost:4001/api/v1/document-upload/update?confirm=1&bookingId=${bookingId}&userId=${userId}&userDocId=${values.id}`
      let rejected_link = `http://localhost:4001/api/v1/document-upload/update?confirm=0&bookingId=${bookingId}&userId=${userId}&userDocId=${values.id}`

      let shopOwnerRes = await usergetByIdRes(shopOwnerId, req.headers.authorization.split(' ')[1])
      let vendorRes = await usergetByIdRes(userId, req.headers.authorization.split(' ')[1])
      let shopRes = await shopgetByIdRes(shopId, req.headers.authorization.split(' ')[1])

      // in html button link want above there
      const fs = require('fs')
      const path = require('path')
      const filePath = path.join(__dirname, '../uploads', `${req.file.filename}`)
      if (fs.existsSync(filePath)) {
        console.log('File exists')
      }
      const imageBuffer = fs.readFileSync(filePath)
      let base64Image = imageBuffer.toString('base64')
      base64Image = `data:image/png;base64,${base64Image}`

      let content = {
        from: vendorRes.userEmail,
        to: shopOwnerRes.userEmail,
        htmlContent: `
        <!DOCTYPE html>
        <html>
        <body>
        <h1>Hi ${shopOwnerRes.userName},</h1>
        <p>Vendor Name: ${vendorRes.userName}</p>
        <p>Shop Name: ${shopRes.shopName}</p>
        <p>Shop Price: ${shopRes.price}</p>
        <span>
        <a href="${confirm_link}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none; border-radius: 5px;">Confirm</a>
        <a href="${rejected_link}" style="padding: 10px 20px; background-color: red; color: white; text-decoration: none; border-radius: 5px; margin-left: 10px;">Reject</a>
        </span>
        </body>
        </html>
        `,
        attachments: [
          {
            filename: 'Document.png',
            path: base64Image
          }
        ],
        subject: 'Booking Document Verify Request'
      }
      console.log('content', content)
      await sendEmail(content)
      await Booking.findByIdAndUpdate(
        { _id: bookingId },
        { bookingStatus: 'Vendor Submitted the Document' }
      )
      return res.status(200).json({ message: 'Document Upload and mail sent Successfully' })
    } else {
      return res.status(500).json({ message: 'Unable to Document Upload' })
    }
  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ message: 'Unable to Upload Document', error: error })
  }
}

// UPDATE DOCUMENT
const updateDocument = async (req, res, next) => {
  try {
    const confirm = req.query.confirm
    if (confirm == 1) {
      await Booking.findByIdAndUpdate(
        { _id: req.query.bookingId },
        { bookingStatus: 'Document Verified and Payment Pending' }
      )
      await userDocument.findByIdAndUpdate(
        { _id: req.query.userDocId },
        { status: 'Document Verified By Owner' }
      )
    } else {
      await Booking.findByIdAndUpdate(
        { _id: req.query.bookingId },
        { bookingStatus: 'Document Rejected By Owner and Re-Submit the Document' }
      )
      await userDocument.findByIdAndUpdate(
        { _id: req.query.userDocId },
        { status: 'Document Rejected By Owner' }
      )
    }
    return res.status(500).json({ message: 'Update Document' })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to Update Document', error: error })
  }
}

module.exports = { createDocument, updateDocument }
