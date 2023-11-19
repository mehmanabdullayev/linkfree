const express = require('express')

const {search, followAction, addPost, getPosts, likePost, suggestions} = require('../controllers/network_controller')

const { upload } = require('../services/multer_service')

/**
 * Router for network_controller.js
 * @type {Router}
 */
const network_router = express.Router()

network_router.all('/search', search)
network_router.post('/follow_action', followAction)
network_router.post('/add_post', upload.single('image'), addPost)
network_router.get('/get_posts', getPosts)
network_router.post('/like_post', likePost)
network_router.get('/suggestions', suggestions)

module.exports = network_router