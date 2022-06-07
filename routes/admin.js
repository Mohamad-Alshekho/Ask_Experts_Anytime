const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { ensureAuthenticated } = require('../config/auth');

router.post('/acceptExpert', ensureAuthenticated, adminController.acceptExpert);

router.post('/declineExpert', ensureAuthenticated, adminController.declineExpert);

router.get('/error', adminController.error);

module.exports = router;