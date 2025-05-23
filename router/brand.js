const express = require("express")
const { verifyToken, checkRole } = require("../middleware/authValidation")
const { addBrand, getAllBrand, pagination } = require("../controller/brand")
const brandRouter = express.Router()

brandRouter.get('/getAll', getAllBrand)
brandRouter.get('/getOne/:id', getAllBrand)
brandRouter.get('/pagination', pagination)



brandRouter.post("/add", verifyToken, checkRole("admin"), addBrand)

module.exports = brandRouter