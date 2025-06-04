const express = require('express')
const { registerVendor, addCategorySubCategory, addLocation, addWorking } = require('../controller/vendor')
const { verifyToken, checkRole } = require('../middleware/authValidation')
const vendorRouter = express.Router()

vendorRouter.post('/register', registerVendor)

vendorRouter.put('/addCategorySubCategory/:id', verifyToken, checkRole('vendor'), addCategorySubCategory) //id of brand
vendorRouter.put('/addLocation/:id', verifyToken, checkRole('vendor'), addLocation) //id of brand
vendorRouter.put('/addWorkHours/:id', verifyToken, checkRole('vendor'), addWorking) //id of brand

module.exports = vendorRouter