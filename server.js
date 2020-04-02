const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const PORT = 3000
const dbConnection = process.env.MONGODB_URI || 'mongodb://localhost:27017/mongo-test'

const { User } = require('./models/user')


mongoose.connect(dbConnection, {useNewUrlParser: true})
  .then(() => console.log('DB connected'))
  .catch((err) => console.error(err))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())


app.post('/api/users/register', (req, res) => {
  const user = new User(req.body)
  user.save((err, userData) => {
    if (err) return res.json({success: false, err})
    return res.status(200).json({success: true})
  })
})


app.listen(PORT, () => console.log(`Server is running on ${PORT}`))