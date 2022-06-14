const router = require('express').Router()
const reviewControl=require('./review_controller')

//Review for product
router.post('/postReview/:productId',reviewControl.createReview)

router.get('/getAll-review',reviewControl.getAllReview)

//Report for product
router.post('/createReport/:productId',reviewControl.createReport)

router.get('/getAll-report',reviewControl.getAllReport)

router.get('/getById-report/:reportId',reviewControl.getByIdReport)

router.delete('/delete-report/:reportId',reviewControl.deleteReport)

module.exports = router