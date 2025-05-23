const express = require('express')
const { getAllCategory, getCategoryPagination, addCategory, updateCategory, deleteCategory } = require('../controller/category')
const { verifyToken, checkRole } = require('../middleware/authValidation')
const categoryRouter = express.Router()


categoryRouter.get('/getAll', getAllCategory)
categoryRouter.get('/getOne/:id', getAllCategory)

categoryRouter.get('/pagination', getCategoryPagination)

categoryRouter.post('/add', verifyToken, checkRole('admin'), addCategory)
categoryRouter.put('/update/:id', verifyToken, checkRole('admin'), updateCategory)
categoryRouter.delete('/delete/:id', verifyToken, checkRole('admin'), deleteCategory)

module.exports = categoryRouter