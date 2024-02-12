 
const {body}=require('express-validator')

exports.Datavalidation=[
  body('email','please put a valid email').isEmail(),
  body('password','password should be at least 6 ').isLength({min:6})
]