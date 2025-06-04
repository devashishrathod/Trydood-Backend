const express = require('express')
const { verifyToken, checkRole } = require('../middleware/authValidation')
const { addMarketPerson } = require('../controller/marketers')
const marketRouter = express.Router()


marketRouter.post('/add', verifyToken, checkRole('admin'), addMarketPerson)

module.exports = marketRouter