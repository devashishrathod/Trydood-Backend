const express = require('express')
const { getAllSubscription, pagination, updateSubscription, subscribed, addSubscription, deleteSubscription } = require('../controller/subscription')
const { verifyToken, checkRole } = require('../middleware/authValidation')
const subscriptionRouter = express.Router()


subscriptionRouter.get('/getAll', getAllSubscription)
subscriptionRouter.get('/getOne/:id', getAllSubscription)
subscriptionRouter.get('/pagination', pagination)

subscriptionRouter.post('/add', verifyToken, checkRole('admin'), addSubscription)
subscriptionRouter.put('/update/:id', verifyToken, checkRole('admin'), updateSubscription)
subscriptionRouter.delete('/delete/:id', verifyToken, checkRole('admin'), deleteSubscription)


// ================================ subscribed ===============================

subscriptionRouter.post('/subscribed/:id', verifyToken, checkRole('vendor'), subscribed) //id will be of subscription

module.exports = subscriptionRouter