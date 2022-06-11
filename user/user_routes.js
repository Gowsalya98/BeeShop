const router=require('express').Router()
const valid=require('../middleware/validation')
const multer=require('../middleware/multer')
const registerControl=require('./user_controller')


router.post('/register',valid.valid,registerControl.userRegister)

router.post('/login',valid.verification,registerControl.login)

router.post('/forgetPassword',valid.verify,registerControl.forgetPassword)

router.post('/image',multer.upload.single('image'),registerControl.imageUpload)

router.get('/getAll',registerControl.getAllUser)

router.get('/getById/:userId',registerControl.getById)

router.put('/update-profile/:userId',registerControl.updateUserDetails)

router.delete('/delete-profile/:userId',registerControl.deleteUserDetails)

module.exports=router