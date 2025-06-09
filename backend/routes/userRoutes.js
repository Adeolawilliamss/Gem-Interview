const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

//SUB MIDDLEWARE FOR THIS MINI-APPLICATION
const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logOut);
router.post('/signup', authController.signUp);

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);

module.exports = router;
