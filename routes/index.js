var express = require('express');
const passport = require('passport');

var router = express.Router();
const user_controller = require('../controllers/UserController');
/* GET home page. */
router.get('/', function (req,res,){
  res.redirect('/home')
})

router.get('/home', user_controller.index);

router.get('/sign-up',user_controller.user_signup_get)

router.post('/sign-up',user_controller.user_signup_post)

router.get('/login', user_controller.user_login_get);

router.post('/login',
passport.authenticate('local',{
  failureRedirect: '/login', failureMessage:'something went wrong'
}),user_controller.user_login_post);

router.get('/logout',user_controller.user_logout_get)


module.exports = router;
