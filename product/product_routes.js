const router=require('express').Router()
const productControl=require('./addProduct_controller')
const sortMenuControl=require('./sortMenu_controller')
const valid=require('../middleware/validation')

//owner profile
router.post('/addProduct',valid.verify,productControl.addProductDetails)
router.get('/ownProduct',productControl.ownerGetOurOwnProductDetails)
router.get('/getAll-productList',productControl.getAll)
router.get('/getById-product/:productId',productControl.getById)
router.put('/update-product/:productId',productControl.updateProduct)
router.delete('/delete-product/:productId',productControl.deleteProduct)

//owner get count for all details
router.get('/product-count',productControl.ownProductCount)
router.get('/productReview-count',productControl.ownProductReviewCount)

//filter API for product
router.get('/newProduct/:categoryName',sortMenuControl.categoryWiseNewest)
router.get('/lowToHigh/:categoryName',sortMenuControl.categoryWiseLowToHigh)
router.get('/highToLow/:categoryName',sortMenuControl.categoryWisehighToLow)





module.exports=router