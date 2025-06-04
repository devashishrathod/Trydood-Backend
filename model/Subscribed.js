const mongoose = require('mongoose')

const subscribedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    duration: {
        type: Number
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    price: {
        type: Number
    },
    discount: {
        type: Number
    },
    subBrand: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: true
    },
    paidAmount: {
        type: Number
    }
}, { timestamps: true })
const Subscribed = mongoose.model('Subscribed', subscribedSchema)
module.exports = Subscribed