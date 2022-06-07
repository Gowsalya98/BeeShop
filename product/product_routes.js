const router=require('express').Router()
const productControl=require('./addProduct_controller')
const valid=require('../middleware/validation')

router.post('/addProduct',valid.verify,productControl.addProductDetails)

router.get('/owner-ownProduct',productControl.ownerGetOurOwnProductDetails)

router.get('/getAll-productList',productControl.getAll)

router.get('/getById-product/:productId',productControl.getById)

router.put('/update-product/:productId',productControl.updateProduct)

router.delete('/delete-product/:productId',productControl.deleteProduct)


module.exports=router