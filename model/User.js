const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: Number
    },
    password: {
        type: String
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'vendor'],
        default: 'user'
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    lastLocation: {
        lat: Number,
        lng: Number
    },
    currentLocation: {
        lat: Number,
        lng: Number
    },
    fcmToken: {
        type: String
    }
}, { timestamps: true })
const User = mongoose.model('User', UserSchema)
module.exports = User