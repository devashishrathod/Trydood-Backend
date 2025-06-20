const mongoose = require('mongoose')

const TermsSchema = new mongoose.Schema({
    terms: {
        type: String
    },
    type: {
        type: String,
        enum: ['web', 'android', 'ios'],
        default: 'web'
    }
}, { timestamps: true })
const Terms = mongoose.model('Terms', TermsSchema)
module.exports = Terms