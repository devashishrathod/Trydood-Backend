const express = require('express')
const { getAllState, addState, updateState, deleteState, getAllHome, getOne, addHomeApplication, updateHomeApplication, deleteHomeApplication, getDealOfCategories, getDealOfDayPagination, addDealOfCategory, updateDealOfCategory, deleteDealOfCategory, getAllPrivacy, getSinglePrivacy, addPrivacy, updatePrivacy, deletePrivacy } = require('../controller/application')
const { verifyToken, checkRole } = require('../middleware/authValidation')
const applicationRouter = express.Router()


// ================================= home ===================================
applicationRouter.get('/home/getOne/:id', getAllHome)
applicationRouter.get('/home/getAll', getAllHome)
applicationRouter.get('/home/single', getOne)
applicationRouter.post('/home/add', verifyToken, checkRole('admin'), addHomeApplication)
applicationRouter.put('/home/update/:id', verifyToken, checkRole('admin'), updateHomeApplication)
applicationRouter.delete('/home/delete/:id', verifyToken, checkRole('admin'), deleteHomeApplication)


// ================================= dealOfDay ===================================
applicationRouter.get('/dealOfDay/getOne/:id', getDealOfCategories)
applicationRouter.get('/dealOfDay/getAll', getDealOfCategories)
applicationRouter.get('/dealOfDay/pagination', getDealOfDayPagination)
applicationRouter.post('/dealOfDay/add', verifyToken, checkRole('admin'), addDealOfCategory)
applicationRouter.put('/dealOfDay/update/:id', verifyToken, checkRole('admin'), updateDealOfCategory)
applicationRouter.delete('/dealOfDay/delete/:id', verifyToken, checkRole('admin'), deleteDealOfCategory)


// ================================= privacy ===================================
applicationRouter.get('/privacy/getOne/:id', getAllPrivacy)
applicationRouter.get('/privacy/getAll', getAllPrivacy)
applicationRouter.get('/privacy/single', getSinglePrivacy)
applicationRouter.post('/privacy/add', verifyToken, checkRole('admin'), addPrivacy)
applicationRouter.put('/privacy/update/:id', verifyToken, checkRole('admin'), updatePrivacy)
applicationRouter.delete('/privacy/delete/:id', verifyToken, checkRole('admin'), deletePrivacy)


// ================================= state ===================================
applicationRouter.get('/state/getAll', getAllState)
applicationRouter.get('/state/getOne/:id', getAllState)

applicationRouter.post('/state/add', verifyToken, checkRole('admin'), addState)
applicationRouter.put('/state/update/:id', verifyToken, checkRole('admin'), updateState)
applicationRouter.delete('/state/delete/:id', verifyToken, checkRole('admin'), deleteState)

module.exports = applicationRouter