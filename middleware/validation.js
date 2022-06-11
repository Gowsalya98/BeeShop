const { body, validationResult } = require('express-validator')

const validation = [
    body('email').isEmail().withMessage('Email must be Valid'),
    body('password').isLength({max:'5',max:'16'}).withMessage('password must be valid')
]

const valid=[
    body('phoneNumber').isLength({min:'10', max:'10'}).withMessage('phoneNumber must be valid'),
    body('password').isLength({min:'5',max:'16'}).withMessage('Password must be valid'),
    body('repeatPassword').isLength({min:'5',max:'16'}).withMessage('repeatPassword must be valid')
]
const verification=[
    body('phoneNumber').isLength({min:'10', max:'10'}).withMessage('phoneNumber must be valid'),
    body('password').isLength({min:'5',max:'16'}).withMessage('password must be valid'),
]
const verify=[
    body('email').isEmail().withMessage('Email must be Valid'),
    body('phoneNumber').isLength({min:'10', max:'10'}).withMessage('phoneNumber must be valid')
]
module.exports = { validation,valid,verify,verification}