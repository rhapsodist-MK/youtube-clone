const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 8000
const config = require('./config/key')



mongoose.connect(config.MONGODB_URI,  {
  useNewUrlParser: true, useUnifiedTopology: true,
  useCreateIndex: true, useFindAndModify: false
})
  .then(() => console.log('DB connected'))
  .catch((err) => console.error(err))

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())


app.use('/api/users', require('./routes/users'))

app.use('/uploads', express.static('uploads'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
  })
}



app.listen(PORT, () => console.log(`Server is running on ${PORT}`))