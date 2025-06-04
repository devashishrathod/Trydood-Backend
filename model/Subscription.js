const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    },
    duration: {
        type: Number
    },
    subBrand: {
        type: Number
    },
    discount: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const Subscription = mongoose.model('Subscription', subscriptionSchema)
module.exports = Subscription