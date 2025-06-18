const mongoose = require('mongoose')

const ApplicationHomeSchema = new mongoose.Schema({
    image: {
        type: String
    },
    title: {
        type: String,
    },
    header: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true })

const ApplicationHome = mongoose.model('ApplicationHome', ApplicationHomeSchema)
module.exports = ApplicationHome