const mongoose = require('mongoose')

const AppDealSchema = new mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String
    },
    title: {
        type: String
    }
}, { timestamps: true })

const AppDeal = mongoose.model('AppDeal', AppDealSchema)
module.exports = AppDeal