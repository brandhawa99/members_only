var createError = require('http-errors');
var logger = require('morgan');
require('dotenv').config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const User = require('./models/user')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

//import index routes
var indexRouter = require('./routes/index');

const mongodb = process.env.MONGO_URI
mongoose.connect(mongodb,{useUnifiedTopology:true,useNewUrlParser:true})
const db = mongoose.connection;
db.on("error", console.error.bind(console,"mongo connection error"));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }) );

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: "Incorrect username" });
    bcrypt.compare(password, user.password, (err, res) => {
      if (err) return done(err);
      // Passwords match, log user in!
      if (res) return done(null, user);
      // Passwords do not match!
      else return done(null, false, { message: "Incorrect password" });
    });
  });
}));
  
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));

  
app.use(session({ secret: 'dog', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session())
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});



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
