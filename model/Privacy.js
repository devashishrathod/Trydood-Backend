const mongoose = require('mongoose')

const PrivacySchema = new mongoose.Schema({
    privacy: {
        type: String
    },
    type: {
        type: String,
        enum: ['web', 'android', 'ios'],
        default: 'web'
    }
}, { timestamps: true })
const Privacy = mongoose.model('Privacy', PrivacySchema)
module.exports = Privacy