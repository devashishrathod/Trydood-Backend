const mongoose = require('mongoose')

const SubBrandSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    name: {
        type: String
    },
    logo: {
        type: String
    },
    cover: {
        type: String
    },
    slogan: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: Number
    },
    whatsappNumber: {
        type: Number
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    descrpition: {
        type: String
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    workHours: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkHours'
    },
    gst: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gst'
    },
    marketPermission: {
        type: Boolean
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const SubBrand = mongoose.model('SubBrand', SubBrandSchema)
module.exports = SubBrand