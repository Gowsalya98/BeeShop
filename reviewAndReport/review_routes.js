const router = require('express').Router()
const reviewControl=require('./review_controller')

router.post('/postReview/:productId',reviewControl.createReview)

module.exports = router