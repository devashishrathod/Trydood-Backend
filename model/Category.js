const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    name: {
        type: String
    },
    image: {
        type: String
    },
    type: {
        type: String,
        enum: ['web', 'android', 'ios']
    }
}, { timestamps: true })
const Category = mongoose.model('Category', CategorySchema)
module.exports = Category