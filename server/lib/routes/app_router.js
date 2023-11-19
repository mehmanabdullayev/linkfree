const express = require('express')

const auth_router = require('./auth_router')
const profile_router = require('./profile_router')
const network_router = require('./network_router')

const app_router = express.Router()

app_router.use('/auth', auth_router)
app_router.use('/profile', profile_router)
app_router.use('/network', network_router)

module.exports = app_router