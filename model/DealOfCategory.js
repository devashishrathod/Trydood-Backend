const mongoose = require('mongoose')

const DealOfCategorySchema = new mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String
    },
    title: {
        type: String
    },
    type: {
        type: String,
        enum: ['web', 'android', 'ios'],
        default: 'web'
    }
}, { timestamps: true })

const DealOfCategory = mongoose.model('DealOfCategory', DealOfCategorySchema)
module.exports = DealOfCategory