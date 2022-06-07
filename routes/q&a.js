const express = require('express');
const router = express.Router();
const q_a_controller = require('../controllers/q&a')
const { ensureAuthenticated } = require('../config/auth');

router.get('/experts', q_a_controller.getExperts);
//router.post('/userSignUp', authController.postUserSignUp);

router.get('/pricing', q_a_controller.getPricing);

router.get('/dashboard',ensureAuthenticated, q_a_controller.getDashboard);


router.get('/getAsk:expertId', ensureAuthenticated, q_a_controller.getAskQuestion);
router.post('/postAskQuestion:expertId', ensureAuthenticated, q_a_controller.postAskQuestion);

router.get('/getQuestions:expertId', ensureAuthenticated,q_a_controller.getExpertQuestions);

router.get('/download:attachmentUrl', q_a_controller.download);

router.post('/answerQuestion:questionId', ensureAuthenticated, q_a_controller.answerQuestion);

router.get('/user-questions:userId', ensureAuthenticated, q_a_controller.getUserQuestions);

router.get('/paymentSuccess', ensureAuthenticated , q_a_controller.paymentHandler);

router.get('/subInfo:userId', ensureAuthenticated , q_a_controller.subInfo);

router.get('/already-sub:userId', ensureAuthenticated , q_a_controller.alreadySub);


module.exports = router;