const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = 3000
const dbConnection = process.env.MONGODB_URI || 'mongodb://localhost:27017/mongo-test'

mongoose.connect(dbConnection, {useNewUrlParser: true})
  .then(() => console.log('DB connected'))
  .catch((err) => console.error(err))

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))