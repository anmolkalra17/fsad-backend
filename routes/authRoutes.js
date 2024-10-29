const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

//  Register user route
router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
], authController.register);

//  Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

//  Send verification email route
router.post('/send-verification-email', authController.sendVerificationEmail);

//  Reset password route
router.post('/reset-password', authController.resetPassword);

module.exports = router;