const User = require('../models/Usermodel')
const { validationResult } =  require('express-validator')
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require('dotenv').config()





const Register = async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(402).json({errors:errors.mapped() })
        }
        
        const {username, email, password ,customerId,subscription} = req.body;          

         
        // verify if the user exists 
        const isfound = await User.findOne({email})
        if(isfound){
           return res.status(401).json({message:'You have already registered!'})
        }
        // hashing of the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //save the user in the DB
        const newUser =  await User.create({username,email,password:hashedPassword,customerId,subscription}) 
        res.status(201).json({newUser,msg:'User has been created successfully'})
    
    } catch (error) {
        res.status(501).json({message:error})
    }
}
const Login = async(req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(402).json({errors:errors.mapped() })
        }
        const {email, password} = req.body
        // vérifier si l'utilisateur n'a pas du compte!!
        const isfound = await User.findOne({email})
        if(!isfound){
            return res.status(403).json({message:'You have to register before !!'})
        }
        // compare the password (req.body) vs password from the DB
        const isMatch = bcrypt.compareSync(password, isfound.password)
        if(!isMatch){
            return res.status(402).json({message:'Wrong password'})
        }
        //generate a token
        const token = await jwt.sign({id:isfound._id},process.env.JWT)
        
        res.status(200).json({token,isfound})

    } catch (error) {
        res.status(501).json({message:error})
    }

}


const googleAuth = async (req, res, next) => {
    try {
      const isfound= await User.findOne({ email: req.body.email });
      if (isfound) {
        const token = jwt.sign({ id: isfound._id }, process.env.JWT);
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json({token,isfound});
      } else {
        const newUser = new User({
          ...req.body,
          fromGoogle: true,
        });
        const isfound = await newUser.save();
        const token = jwt.sign({ id: isfound._id }, process.env.JWT);
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          . json({token,isfound})
  
      }
    } catch (err) {
      next(err);
    }
  };



























 





module.exports = {Register,Login ,googleAuth}