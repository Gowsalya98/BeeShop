const router=require('express').Router()
const packageControll=require('./package_contoller')

router.post('/create-orderId',packageControll.createOrderId)

router.post("/subscripitionPlan/:productId",packageControll.subscriptionPlan)

router.get('/getAll-payment',packageControll.getAll)

router.get('/getById-payment/:paymentId',packageControll.getById)

//filterForPremiumPackage
router.get('/',packageControll.filterToPremiumPackage)

module.exports=router