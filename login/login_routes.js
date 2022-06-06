const router=require('express').Router()
const valid=require('../middleware/validation')
const multer=require('../middleware/multer')
const registerControl=require('./login_controller')


router.post('/register',valid.valid,registerControl.userRegister)

router.post('/login',valid.valid,registerControl.loginForUser)

router.post('/image',multer.upload.single('image'),registerControl.imageUpload)

router.post('/verification',registerControl.verificationOtp)

router.get('/getAll',registerControl.getAllUser)

router.get('/getById/:userId',registerControl.getById)

router.put('/updateProfile/:userId',registerControl.updateUserDetails)

router.delete('/deleteProfile/:userId',registerControl.deleteUserDetails)

module.exports=router