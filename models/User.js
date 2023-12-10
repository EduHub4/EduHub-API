const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken')

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    profilePhoto: {
        type: Object,
        default: {
            url: 'https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/',
            publicId: null
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

// Generate Auth Token 
UserSchema.methods.generateToken = function () {
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET)
}

// User Model 
const User = mongoose.model('User', UserSchema)

// Validate Register User
function validateRegiterUser(obj){
    const schema = Joi.object({
        username: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().trim().min(5).max(100).required().email(),
        password:Joi.string().trim().min(8).required()
    })
    return schema.validate(obj)
}

// Validate Login User 
function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password:Joi.string().trim().min(8).required()
    })
    return schema.validate(obj)
}

// Validate Update Profile 
function validateUpdateProfile(obj) {
    const schema = Joi.object({
        username: Joi.string().trim().min(2).max(100),
        password:Joi.string().trim().min(8)
    })
    return schema.validate(obj)
}

module.exports = {
    User, 
    validateRegiterUser,
    validateLoginUser,
    validateUpdateProfile
}