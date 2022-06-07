const router = require('express').Router()

const {superAdminRegister,superAdminLogin} = require('./super_controller')

const validation = require('../middleware/validation')

router.post('/register', validation.validation,superAdminRegister)

router.post('/login', validation.validation,superAdminLogin)

//router.post('/forgetPassword',validation.validation,forgetPassword)

module.exports = router