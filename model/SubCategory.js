const mongoose = require('mongoose')

const SubCategorySchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    image: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    type: {
        type: String,
        enum: ['web', 'android', 'ios']
    }
}, { timestamps: true })
const SubCategory = mongoose.model('SubCategory', SubCategorySchema)
module.exports = SubCategory