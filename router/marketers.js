const express = require('express')
const { verifyToken, checkRole } = require('../middleware/authValidation')
const { addMarketPerson, getAllMarketPerson, pagination } = require('../controller/marketers')
const marketRouter = express.Router()

marketRouter.get('/getAll', getAllMarketPerson)
marketRouter.get('/getOne/:id', getAllMarketPerson)
marketRouter.get('/pagination', pagination)

marketRouter.post('/add', verifyToken, checkRole('admin'), addMarketPerson)

module.exports = marketRouter