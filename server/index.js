require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/users', require('./routes/user.routes'))
app.use('/api/messages', require('./routes/message.routes'))

// Serve the built React client
const dist = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(dist))
app.get('*', function (req, res, next) {
  if (req.path.indexOf('/api/') === 0) return next() // unknown API route -> real 404, not index.html
  res.sendFile(path.join(dist, 'index.html'))
})

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yt'

// Listen immediately — the site must load even while MongoDB connects
// (or when no database is configured at all)
app.listen(PORT, function () { console.log('Server + client on http://localhost:' + PORT) })

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(function () { console.log('MongoDB connected') })
  .catch(function (err) {
    console.error('MongoDB connection failed: ' + err.message)
    console.error('The site works, but API routes will fail until MONGODB_URI points at a running MongoDB.')
  })
