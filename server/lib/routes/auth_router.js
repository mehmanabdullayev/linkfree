const express = require('express')

const { registration, login, logout, contactUs } = require('../controllers/auth_controller')

const { upload } = require('../services/multer_service')

/**
 * Router for auth_controller.js
 * @type {Router}
 */
const auth_router = express.Router()

auth_router.post('/registration', upload.single('image'), registration)
auth_router.post('/login', login)
auth_router.get('/logout', logout)
auth_router.post('/contact_us', contactUs)

module.exports = auth_router