const mongoose = require('mongoose')

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

module.exports = { User: mongoose.model('User', userSchema) }