const express = require('express')
const { loginEmail, registorUser, loginMobile, requistOtp, verifyOtp, userProfile, login, userProfileComplete } = require('../controller/user')
const { verifyToken } = require('../middleware/authValidation')
const { isFirst } = require('../middleware/helper')
const userRouter = express.Router()


userRouter.get('/userProfile', verifyToken, userProfile)

userRouter.post('/register', registorUser)
userRouter.post('/loginEmail', loginEmail)
userRouter.post('/loginMobile', loginMobile)

userRouter.post('/requistOtp', requistOtp)
userRouter.post('/verifyOtp', verifyOtp)

userRouter.post('/login', login)

userRouter.put('/userProfile/update', verifyToken, userProfileComplete)
userRouter.put('/userProfileComplete', [verifyToken, isFirst], userProfileComplete)
module.exports = userRouter