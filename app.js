var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local')
var session = require('express-session');
const User = require('./models/user')

var indexRouter = require('./routes/index');

const mongodb = process.env.MONGO_URI
mongoose.connect(mongodb,{useUnifiedTopology:true,useNewUrlParser:true})
const db = mongoose.connection;
db.on("error", console.error.bind(console,"mongo connection error"));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


passport.use(new LocalStrategy(function verify (username,password, cb){
  User.findOne({'username': username}, (err,user)=>{
    if(err){
      return cb(err);
    }
    if(!user){
      return cb(null,false,{message:"Incorrect username"})
    }
    if(user.password !== password){
      return cb(null,false,{message:"Incorrect Password"})
    }
    return cb(null,user);
  })
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
