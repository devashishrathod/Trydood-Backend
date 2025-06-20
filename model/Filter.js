const mongoose = require('mongoose')

const FilterSchema = new mongoose.Schema({
    name: {
        type: String
    },
    type: {
        type: String,
        enum: ['web', 'android', 'ios'],
        default: 'web'
    }
}, { timestamps: true })
const Filter = mongoose.model('Filter', FilterSchema)
module.exports = Filter