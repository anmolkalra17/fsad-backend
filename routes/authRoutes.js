const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

//  Validate input httpBody fields
router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
], authController.register);

//  Login Route
router.post('/login', authController.login);

//  Reset Password Route
router.post('/reset-password', authController.resetPassword);

module.exports = router;