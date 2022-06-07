const express = require('express');

const User = require('../models/user');
const authController = require('../controllers/auth');
const { forwardAuthenticated } = require('../config/auth');

const router = express.Router();

router.get('/userSignUp', forwardAuthenticated, authController.getSignUpUser);
router.post('/userSignUp', authController.postUserSignUp);

router.get('/expertSignUp', forwardAuthenticated, authController.getExpertSignUp);
router.post('/expertSignUp', authController.postExpertSignUp);

router.get('/login', forwardAuthenticated, authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/logout', authController.getLogOut);
router.get('/postLogout', authController.postLogout);

router.get('/resetPassword', authController.getResetPassword);
router.post('/resetPassword', authController.postResetPassword);


module.exports = router;
