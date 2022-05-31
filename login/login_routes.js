const router=require('express').Router()
const valid=require('../middleware/validation')
const multer=require('../middleware/multer')
const loginControl=require('./login_controller')

router.post('/login',valid.validation,loginControl.loginForUser)

router.post('/image',multer.upload.single('image'),loginControl.imageUpload)

router.post('/verification',loginControl.verificationOtp)

router.get('/getAll',loginControl.getAllUser)

router.get('/getById/:userId',loginControl.getById)

router.put('/updateProfile/:userId',loginControl.updateUserDetails)

router.delete('/deleteProfile/:userId',loginControl.deleteUserDetails)

module.exports=router