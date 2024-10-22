const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');

//  Create transaction route
router.post('/create', authMiddleware, transactionController.createTransaction);

//  Get transaction history route
router.get('/history', authMiddleware, transactionController.getTransactionHistory);

//  Get received transactions route
router.get('/received', authMiddleware, transactionController.getReceivedTransactions);

//  Update transaction status route
router.put('/update/:id', authMiddleware, transactionController.updateTransactionStatus);

//  Cancel transaction route
router.delete('/cancel/:id', authMiddleware, transactionController.cancelTransaction);

module.exports = router;