const express = require('express')
const { verifyToken, checkRole } = require('../middleware/authValidation')
const sellRouter = express.Router()
const { addMarketPerson } = require('../controller/sell')


sellRouter.post('/add', verifyToken, checkRole('admin'), addMarketPerson)

module.exports = sellRouter