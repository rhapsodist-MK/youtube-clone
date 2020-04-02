const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
  token: {
    type: String,
  },
  tokenExp: {
    type: Number
  }
})


userSchema.pre('save', (next) => {
  const user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err)
  
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err)
  
        user.password = hash
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = (plainPassword, callback) => {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}

userSchema.methods.generateToken = (callback) => {
  const user = this
  const token = jwt.sign(user._id.toHexString(), 'secret')

  user.token = token
  user.save((err, user) => {
    if(err) return callback(err)
    callback(null, user)
  })
}


module.exports = { User: mongoose.model('User', userSchema) }