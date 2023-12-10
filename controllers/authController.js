const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const { User, validateRegiterUser, validateLoginUser } = require('../models/User') 

/**
 * @description Register New User 
 * @route       /smart-diagnosis/auth/register
 * @method      POST
 * @access      public
 */
module.exports.registerUser = asyncHandler( async (req, res) => {
    const { error }  = validateRegiterUser(req.body)
    if(error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    let user = await User.findOne({ email: req.body.email })
    if(user) {
        return res.status(400).json({ message: 'user already exist' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    user = new User({
        username: req.body.username, 
        email: req.body.email, 
        password: hashedPassword
    })
    await user.save()
    // TODO: sending verification email

    res.status(201).json({ message: 'you registered successfully, please log in' })
})

/**
 * @description Login User 
 * @route       /smart-diagnosis/auth/login
 * @method      POST
 * @access      public
 */
module.exports.loginUser = asyncHandler(async (req, res) => {

    const {error} = validateLoginUser(req.body)
    if(error) {
        return res.status(400).json({ message: error.details[0].message })
    } 

    const user = await User.findOne({ email: req.body.email })

    if(!user) {
        return res.status(400).json({ message: 'invalid email or password' })
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
    if(!isPasswordMatch) {
        return res.status(400).json({ message: 'invalid email or password' })
    }

    // TODO: sending verification email (if accound does not verified)

    const token = user.generateToken()

    res.status(200).json({
        _id: user._id,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto, 
        token
    })
})