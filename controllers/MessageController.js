const Message = require('../models/message');


exports.message_get = function(req,res,next){
  if(req.user=== undefined){
    res.redirect('/log-in')
  }
  res.render('message_form',{title:'Create A Post', user:req.user})
}

exports.message_post = [


  (req,res,next) =>{
    let message = new Message({
      title: req.body.title,
      message: req.body.message,
      user: req.body.userid
    });
    message.save(function(err){
      if(err){return next(err)}
      console.log(req.user._id)
      res.redirect('/home');

    })

  }

]