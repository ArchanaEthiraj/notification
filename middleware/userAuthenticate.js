const jwt = require('jsonwebtoken')

const authenticating = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    console.log('token', token)

    const decode = jwt.verify(token, process.env.JWT_TOKEN)
    console.log('decode', decode)
    req.user = decode
    next()
  } catch (error) {
    return res.json({
      message: 'Authentication failed!'
    })
  }
}

const checkShopOwner = (req, res, next) => {
  try {
    let userType = req.user.userType
    if (userType == 'Shop Owner') {
      next()
    } else {
      throw 'Forbidden'
    }
  } catch (error) {
    return res.json({
      message: error
    })
  }
}
const checkVendor = (req, res, next) => {
  try {
    let userType = req.user.userType
    if (userType == 'Vendor') {
      console.log('userType1', userType)
      next()
    } else {
      throw 'Forbidden'
    }
  } catch (error) {
    return res.json({
      message: error
    })
  }
}

module.exports = { authenticating, checkShopOwner,checkVendor }
