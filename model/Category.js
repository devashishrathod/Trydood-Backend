const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    image: {
        type: String
    }
}, { timestamps: true })
const Category = mongoose.model('Category', CategorySchema)
module.exports = Category