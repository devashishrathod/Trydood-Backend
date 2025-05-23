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
    address: {
        type: String,
    },
    dob: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'vendor'], //vendor means brand
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
    },
    referCode: {
        type: String,
        unique: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    applyReferalCode: {
        type: String,
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    follwer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    blockUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    instagram: {
        isLinked: {
            type: Boolean,
            default: false
        },
        authToken: {
            type: String
        }
    },
    facebook: {
        isLinked: {
            type: Boolean,
            default: false
        },
        authToken: {
            type: String
        }
    },
    twitter: {
        isLinked: {
            type: Boolean,
            default: false
        },
        authToken: {
            type: String
        }
    },
    linkedIn: {
        isLinked: {
            type: Boolean,
            default: false
        },
        authToken: {
            type: String
        }
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    bankAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount'
    },
    gst: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gst'
    },
    workHour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkHours'
    }
}, { timestamps: true })
const User = mongoose.model('User', UserSchema)
module.exports = User