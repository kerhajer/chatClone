const express = require('express');
const {Datavalidation}=require('../Authmiddleware/Datavalidation')
const Usercontroller=require('../controllers/Usercontroller')


const router = express.Router();

router.post('/Register',Datavalidation, Usercontroller.Register ) 


router.post('/Login',Usercontroller.Login)
router.post("/google", Usercontroller.googleAuth)


module.exports = router;






