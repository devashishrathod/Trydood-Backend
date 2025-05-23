const mongoose = require('mongoose')

const GstSchema = new mongoose.Schema({
    companyName: {
        type: String
    },
    gstNumber: {
        type: String
    },
    zipCode: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
}, { timestamps: true })
const Gst = mongoose.model('Gst', GstSchema)
module.exports = Gst