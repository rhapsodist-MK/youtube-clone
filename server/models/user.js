const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require("moment")

const saltRounds = 10

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastName: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0  //0 : normal user, 1 : admin user
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number
  }
})


// es6 불가
userSchema.pre('save', function(next) {
  const user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err)
  
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}

userSchema.methods.generateToken = function (callback) {
  const user = this

  const token = jwt.sign(user._id.toHexString(), 'secret')
  const oneHour = moment().add(1, 'hour').valueOf()

  user.tokenExp = oneHour
  user.token = token
  
  user.save((err, user) => {
    if(err) return callback(err)
    callback(null, user)
  })
}

userSchema.statics.findByToken = function (token, callback) {
  const user = this

  jwt.verify(token, 'secret', (err, decode) => {
    user.findOne({_id: decode, token}, (err, user) => {
      if(err) return callback(err)
      callback(null, user)
    })
  })
}


module.exports = { User: mongoose.model('User', userSchema) }