const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    subBrand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubBrand'
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    image: {
        type: String
    },
    type: {
        type: String,
        enum: ['web', 'android', 'ios']
    }
}, { timestamps: true })

const Image = mongoose.model('Image', ImageSchema)
module.exports = Image