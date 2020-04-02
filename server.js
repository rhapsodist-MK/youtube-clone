const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const PORT = 3000
const config = require('./config/key')

const { User } = require('./models/user')


mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true})
  .then(() => console.log('DB connected'))
  .catch((err) => console.error(err))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())


app.post('/api/users/register', (req, res) => {
  const user = new User(req.body)
  user.save((err, userData) => {
    if (err) return res.json({success: false, err})
    return res.status(200).json({success: true, userData})
  })
})

app.post('/api/user/login', (req, res) => {
  // find the email
  User.findOne({email: req.body.email}, (err, user) => {
    if (!user) return res.json({loginSuccess: false, message: "Auth failed, email not found"})

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({loginSuccess: false, message: "wrong password"})
    })

    user.generateToken((err, user) => {
      if(err) return res.status(400).send(err)
      res.cookie('x_auth', user.token)
        .status(200)
        .json({loginsuccess: true})
    })
  })
})


app.listen(PORT, () => console.log(`Server is running on ${PORT}`))