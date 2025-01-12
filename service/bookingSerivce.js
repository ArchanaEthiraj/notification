const joi = require('joi')

// BOOKING VALIDATE SCHEMA
const bookingValidate = async (req, res, next) => {
    try {
      console.log('req.body', req.body)
      const bookingSchema = joi.object({
        shopId: joi.string().required(),
        shopOwnerId: joi.string().required(),
      })
      let { error, value } = await bookingSchema.validateAsync(req.body)
      if (error) {
        throw error
      } else {
        next()
      }
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  }

module.exports = { bookingValidate }
