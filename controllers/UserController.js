const{body, validationResult, check} = require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Message = require('../models/message')


exports.index = function(req,res){
  Message.find()
  .sort({timestamp:-1})
  .populate('user')
  .exec(function(err,messages){
    if(err){return next(err)}
    res.render('index',{title:'Members Only', user:req.user,messages:messages})
  })
}

exports.user_signup_get = function(req,res){
  res.render('signup_form',{title:'Sign Up', errors:[]})
}

exports.user_signup_post = [
  body('username').trim().escape().isLength({min:1}).withMessage("Username is required"),
  body('password').trim().escape().isLength({errorMessage:"password must be 4 characters long", min:4}),
  body('password2').trim().escape(),
  check('password2','passwords do not match')
    .custom((val,{req})=>{
      if(val === req.body.password){
        return true;
      }else{
        return false;
      }
    }),
  check('username','username already exists')
    .custom(async(val)=>{
      return User.findOne({'username':val}).then(user =>{
        if(user !== null){
          return Promise.reject("username already in use")
        }
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
        res.redirect('/log-in');
      })
    }
  }
]

exports.user_login_get = function(req,res,next){
  res.render('login_form',{title:'Log In', errors:[]})
}

exports.user_login_post = passport.authenticate('local',{
  successRedirect: '/home',
  failureRedirect: '/log-in'
})

exports.user_logout_get = function (req,res,next){
  req.logout()
  res.redirect('/home')
}

exports.user_delete_msg_get = function(req,res,next){
  Message.findById(req.params.id)
    .exec(function(err,msg){
      if(err){return next(err)}
      res.render('delete_msg', {msg:msg})
    })
}

exports.user_delete_msg_post = function (req,res,next){
  Message.findByIdAndDelete(req.body.msgid)
    .exec(function(err,results){
      if(err){return next(err)}
      res.redirect('/home');
    })

}

exports.user_make_admin_get = function(req,res,next){
  res.send('need to implement')

}

exports.user_make_admin_post = function(req,res,next){
  res.send('need to implement')

}
