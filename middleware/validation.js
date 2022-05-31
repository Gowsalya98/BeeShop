const { body, validationResult } = require('express-validator')

const validation = [
    body('email').isEmail().withMessage('Email must be Valid'),
    body('contact').isLength({min:'10', max:'10'}).withMessage('contact number must be valid')
]

const valid=[
    body('email').isEmail().withMessage('Email must be Valid'),
    body('password').isLength({max:'5'}).withMessage('Password must be valid')
]

module.exports = { validation,valid}