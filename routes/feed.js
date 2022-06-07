const express = require('express');

const router = express.Router();

const { ensureAuthenticated } = require('../config/auth');

const feedController = require('../controllers/feed');
const q_a_controller = require('../controllers/q&a');

router.get('/feed', feedController.getPosts);

router.post('/postAddPost', ensureAuthenticated, feedController.postAddPost);

router.post('/addComment', ensureAuthenticated, feedController.addComment);

router.post('/edit-comment/:id', ensureAuthenticated, feedController.editComment);

router.post('/delete-comment/:id', ensureAuthenticated, feedController.deleteComment)

router.get('/postsInfo', feedController.getPostsInfo);

router.get('/editProfile', ensureAuthenticated, feedController.editProfile);

router.get('/editUserProfile', ensureAuthenticated, feedController.editUserProfile);

router.post('/postEditProfile', ensureAuthenticated, feedController.postEditProfile);

module.exports = router;