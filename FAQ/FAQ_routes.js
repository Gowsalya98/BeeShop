const router=require('express').Router()

const FAQControl=require('./FAQ_controller')

router.post('/create-FAQ',FAQControl.createFAQ)

router.get('/getAll',FAQControl.getAll)

router.put('/update-FAQ/:id',FAQControl.updateFAQ)

router.delete('/remove-FAQ/:id',FAQControl.removeFAQ)


module.exports=router