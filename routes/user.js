const express = require('express');
const router = express.Router();
const passport = require('passport');


const userController = require('../controllers/user_controller');

router.post('/create',userController.create);
router.get('/profile',userController.profile);
router.get('/login',userController.login);
router.get('/forgot_password',userController.forgot_password);
router.post('/forgot-password-form',userController.forgot_password_form);

router.get('/sign-up',userController.sign_up);

router.get('/balance/:id',userController.balance);
router.get('/account-details/:id',userController.details);

router.get('/update-details',userController.update);
router.post('/update-details/:id',passport.checkAuthentication,userController.update_db);

router.get('/reset-password',userController.resetpassword);
router.post('/reset-password-form',userController.resetpasswordform);

//use passport a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : '/user/login'},
),userController.createSession); // if authentication success then userController->createSession is called

router.get('/sign-out',userController.destroySession);

module.exports = router;