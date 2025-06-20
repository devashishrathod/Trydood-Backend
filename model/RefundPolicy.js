const mongoose = require('mongoose')

const RefundPolicySchema = new mongoose.Schema({
    refundPolicy: {
        type: String
    },
    type: {
        type: String,
        enum: ['web', 'android', 'ios'],
        default: 'web'
    }
}, { timestamps: true })

const RefundPolicy = mongoose.model('RefundPolicy', RefundPolicySchema)
module.exports = RefundPolicy