const express = require('express')
const cors = require('cors')
const xssClean = require('xss-clean')
const helmet = require('helmet')
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')

const app = express()

const app_router = require('./routes/app_router')
const syncDatabase = require('./database/syncDatabase')
const { rateLimiter } = require('./middlewares/security_middleware')
const authMiddleware = require("./middlewares/auth_middleware")

syncDatabase()

app.use(cors({credentials: true, origin: process.env.CLIENT_ORIGIN}))
app.use(helmet())
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_KEY,
        cookie: { sameSite: 'None', domain: process.env.CLIENT_ORIGIN.replace('http://', '') }
    })
)
app.use(cookieParser(process.env.COOKIE_KEY))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(xssClean())
app.use(rateLimiter)
app.use(authMiddleware)
/**
 * Uploaded files are saved and also served from uploads directory by multer.
 * However, any CDN can be picked and configured according to business requirements to serve files.
 */
app.use(express.static('uploads'))
app.use('/api', app_router)

module.exports = app
