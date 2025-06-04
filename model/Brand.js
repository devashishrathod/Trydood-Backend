const mongoose = require('mongoose')

const BrandSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    companyName: {
        type: String
    },
    pan: {
        type: String
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
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    referApply: {
        type: String
    },
    subscribed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscribed'
    },
    isSubscribed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
const Brand = mongoose.model('Brand', BrandSchema)
module.exports = Brand