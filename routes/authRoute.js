const router = require('express').Router()
const { registerUser, loginUser } = require('../controllers/authController')

// = /eduhub/auth/register
router.post(
    '/register', 
    registerUser
)

// = /eduhub/auth/login
router.post(
    '/login', 
    loginUser
)

module.exports = router