const express = require('express')
const { verifyToken, checkRole } = require('../middleware/authValidation')
const { getAllSubCategory, getSubCategoryPagination, subCategoryByCategoryPagination, subCategoryByCategory, addSubCategory, updateSubCategory, deleteSubCategory, updateStatus } = require('../controller/subCategory')
const subCatRouter = express.Router()


subCatRouter.get('/getAll', getAllSubCategory)
subCatRouter.get('/getOne/:id', getAllSubCategory)

subCatRouter.get('/pagination', getSubCategoryPagination)
subCatRouter.get('/category/pagination/:id', subCategoryByCategoryPagination)
subCatRouter.get('/category/:id', subCategoryByCategory)

subCatRouter.post('/add', verifyToken, checkRole('admin'), addSubCategory)
subCatRouter.put('/update/:id', verifyToken, checkRole('admin'), updateSubCategory)
subCatRouter.put('/update/status/:id', verifyToken, checkRole('admin'), updateStatus)
subCatRouter.delete('/delete/:id', verifyToken, checkRole('admin'), deleteSubCategory)

module.exports = subCatRouter