const mongoose = require('mongoose')
const express = require('express')
const app = express()
const dotEnv = require('dotenv')
const routers = require('./routes')
const path =  require('path')
app.use(express.json())
dotEnv.config()

app.use(
  require('morgan')('dev', {
    // skip: function (req, res) { return res.statusCode < 400 }
  })
)
routers(app)

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use('/images', express.static(path.join(__dirname, 'uploads')));
mongoose.connect(process.env.URL_LOCAL)
const db = mongoose.connection
db.on('error', (error) => {
  console.log(error)
})
db.on('open', () => {
  console.log('Database  Connected Successfully!')
})

app.listen(process.env.PORT, () => {
  console.log(`App is Listening in port ${process.env.PORT}`)
})
