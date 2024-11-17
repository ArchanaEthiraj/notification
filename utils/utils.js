const nodemailer = require('nodemailer')
const path = require('path')

const sendEmail = async (obj) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'archana05.doodleblue@gmail.com',
      pass: 'vudl cndb pugr mitm'
    }
  })
  console.log('transporter ---->', transporter)
  const mailOptions = {
    // from: 'archana05.doodleblue@gmail.com',
    from: obj.from,
    to: obj.to,
    subject: obj.subject,
    html: obj.htmlContent
  }

  try {
    console.log('mailOptions ---->', mailOptions)
    const info = await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.log('error ---->', error)
    throw error;
  }
}

module.exports = {sendEmail}