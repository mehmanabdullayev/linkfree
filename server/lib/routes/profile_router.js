const express = require('express')

const { getUserData, editInfo, addElement} = require('../controllers/profile_controller')

/**
 * Router for profile_controller.js
 * @type {Router}
 */
const profile_router = express.Router()

profile_router.get('/get_user_data', getUserData)
profile_router.post('/edit_info', editInfo)
profile_router.post('/add_certificate', addElement)
profile_router.post('/add_education', addElement)
profile_router.post('/add_education', addElement)
profile_router.post('/add_interest', addElement)
profile_router.post('/add_position', addElement)
profile_router.post('/add_project', addElement)
profile_router.post('/add_skill', addElement)

module.exports = profile_router