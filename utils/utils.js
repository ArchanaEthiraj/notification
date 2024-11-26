const nodemailer = require('nodemailer')
const path = require('path')

// EMAIL FUNCTION
const sendEmail = async (obj) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'archana05.doodleblue@gmail.com',
      pass: 'vudl cndb pugr mitm'
    }
  })
  const mailOptions = {
    from: obj.from,
    to: obj.to,
    subject: obj.subject,
    html: obj.htmlContent
  }

  if (obj.attachments) {
    mailOptions.attachments = obj.attachments
  }
  try {
    console.log('mailOptions ---->', mailOptions)
    const info = await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.log('error ---->', error)
    throw error
  }
}

module.exports = { sendEmail }
