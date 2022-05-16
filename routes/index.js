var express = require('express');
var router = express.Router();
const message_controller = require('../controllers/MessageController');
const user_controller = require('../controllers/UserController');
/* GET home page. */
router.get('/', function (req,res,){
  res.redirect('/home')
})

//user routes
router.get('/home', user_controller.index);

router.get('/sign-up',user_controller.user_signup_get)

router.post('/sign-up',user_controller.user_signup_post)

router.post('/log-in',user_controller.user_login_post)

router.get('/log-in',user_controller.user_login_get)

router.get('/secret_admin',user_controller.user_make_admin_get)
router.get('/secret_admin',user_controller.user_make_admin_post)

router.get('/logout',user_controller.user_logout_get)

//message routes
router.get('/create-message',message_controller.message_get)

router.post('/create-message',message_controller.message_post)

router.get('/delete/:id',user_controller.user_delete_msg_get)

router.post('/delete/:id',user_controller.user_delete_msg_post)


module.exports = router;
