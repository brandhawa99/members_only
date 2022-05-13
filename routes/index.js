var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/UserController')
/* GET home page. */
router.get('/', user_controller.index);

router.get('/sign-up',user_controller.user_signup_get)

router.post('/sign-up',user_controller.user_signup_post)

router.get('/login', user_controller.user_login_get);

module.exports = router;
