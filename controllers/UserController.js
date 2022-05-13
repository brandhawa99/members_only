const{body, validationResult, check} = require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcryptjs');

exports.index = function(req,res){
  res.render('index',{title:'Members Only'})
}

exports.user_signup_get = function(req,res){
  res.render('signup_form',{title:'Sign Up', errors:[]})
}

exports.user_signup_post = [
  body('username').trim().escape().isLength({min:1}).withMessage("Username is required")
    .isAlphanumeric().withMessage("Must only be alphanumeric"),
  body('password').trim().escape().isLength({errorMessage:"password must be 4 characters long", min:4}),
  body('password2').trim().escape(),
  check('password2','passwords do not match')
    .custom((val,{req})=>{
      console.log("val ",val, " password ", req.body.password)
      if(val === req.body.password){
        return true;
      }else{
        return false;
      }
    }),
  check('username','username already exists')
    .custom((val)=>{
      User.findOne({'username':val},function(err,name){
        if(err){return next(err)}
        console.log(name, " THIS IS THE VALUE OF NAME");
        if(name == null){
          return true;
        }
        return false;
      })
    }),

  (req,res,next)=>{
    
    const errors = validationResult(req);
    
    //check if there were any errors in the that came from the validator
    if(!errors.isEmpty()){
      res.render('signup_form',{title:'Sign Up', errors: errors.array() })
    }else{
      bcrypt.hash(req.body.password, 10, (err,hashed)=>{
        const user = new User({
          username: req.body.username,
          password: hashed,
        }).save(err =>{
          if(err){return next(err)}
        })
        if(err){return next(err)}
        res.redirect('/');
      })
    }
  }
]

exports.user_login_get = function(req,res,next){
  res.render('login_form', {title:'Login', errors:[]})
}