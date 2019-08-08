const router = require('express').Router()
const authMiddleWare = require('../../middlewares/auth')
const auth = require('./auth')
const user = require('./user')


router.use('/auth',auth)
router.use('/user',authMiddleWare) //add authMiddleWare in user api
router.use('/user',user)

module.exports = router

