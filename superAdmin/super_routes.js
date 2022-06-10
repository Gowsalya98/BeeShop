const router = require('express').Router()

const superControl = require('./super_controller')

const validation = require('../middleware/validation')

router.post('/register', validation.validation,superControl.register)

router.post('/login', validation.validation,superControl.login)

router.post('/create-package',superControl.createPackageForSuperAdmin)

router.get('/getAll-package',superControl.getAllPackage)

router.put('/update-package/:packageId',superControl.updatePackage)

router.delete('/delete-package/:packageId',superControl.deletePackage)

//router.post('/forgetPassword',validation.validation,forgetPassword)

module.exports = router