const express = require('express')
const path = require('path')
const helmet = require('helmet') // v1.0.5
const cors = require('cors')

require('dotenv').config()

const users = require('./routers/users')
const videos = require('./routers/videos')
const auth = require('./routers/auth')
const upload = require('./routers/upload')
const comments = require('./routers/comments')
const messages = require('./routers/messages')
const conversations = require('./routers/conversations')
const notifications = require('./routers/notifications')

const app = express()

// Connect to DB
const db = require('./config/db')
db.connect()

// Static files
app.use(express.static(path.join(__dirname, 'public')))

app.use(
    express.urlencoded({
        extended: true,
        litmit: '30mb',
    })
)
app.use(
    express.json({
        limit: '30mb',
    })
)
app.use(helmet())
app.use(cors())

app.use('/api/users', users)
app.use('/api/videos', videos)
app.use('/api/auth', auth)
app.use('/api/upload', upload)
app.use('/api/comments', comments)
app.use('/api/messages', messages)
app.use('/api/conversations', conversations)
app.use('/api/notifications', notifications)

app.listen(process.env.API_PORT, () => {
    console.log(`API listening on port ${process.env.API_PORT}`)
})
