const express = require('express');
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

//  User profile fetch route
router.get('/:id', userController.getUserProfile);

module.exports = router;