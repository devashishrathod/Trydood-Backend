const mongoose = require('mongoose')

const BankAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String
    },
    accountNumber: {
        type: String
    },
    ifscCode: {
        type: String
    },
    upiId: {
        type: String
    },
    upiName: {
        type: String
    },
}, { timestamps: true })
const BankAccount = mongoose.model('BankAccount', BankAccountSchema)
module.exports = BankAccount