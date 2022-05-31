const router=require('express').Router()

const categoryControl=require('./category_controller')

router.post('/addCategory',categoryControl.addCategory)

router.get('/getAll-category',categoryControl.getAllCategory)

router.get('/getById-category/:categoryId',categoryControl.getById)

router.put('/update-category/:categoryId',categoryControl.updateCategory)

router.delete('/delete-category/:categoryId',categoryControl.deleteCategory)

module.exports=router