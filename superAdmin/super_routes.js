const router = require('express').Router()

const superControl = require('./super_controller')

const validation = require('../middleware/validation')

router.post('/register', validation.validation,superControl.register)

router.post('/login', validation.validation,superControl.login)

//router.post('/forgetPassword',validation.validation,forgetPassword)

module.exports = router