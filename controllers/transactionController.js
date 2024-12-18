const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {

        if(!req.user) {
            return res.status(401).json({ message: 'User not authenticated to create this transaction.' });
        }

        const newTransaction = new Transaction({
            userId: req.user.id,
            bookId: req.body.bookId,
            recipientUserId: req.body.recipientUserId
        });
        const transaction = await newTransaction.save();
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
    try {

        if(!req.user) {
            return res.status(401).json({ message: 'User not authenticated to create this transaction.' });
        }

        const transactions = await Transaction.find({ userId: req.user.id }).populate('bookId');
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get transactions received by the logged-in user
exports.getReceivedTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ recipientUserId: req.user.id })
          .populate('userId', 'name')
          .populate('bookId', 'title');
    
        res.json(transactions);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

// Update transaction status
exports.updateTransactionStatus = async (req, res) => {
    const { status } = req.body;
    try {

        if(!req.user) {
            return res.status(401).json({ message: 'User not authenticated to create this transaction.' });
        }

        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Could not find this transaction.' });
        }
        transaction.status = status;
        transaction.updatedAt = Date.now();
        await transaction.save();

        // Notify user
        console.log(`Notification: Transaction ${transaction._id} status changed to ${status}`);

        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Cancel a transaction
exports.cancelTransaction = async (req, res) => {
    try {
        
        if(!req.user) {
            return res.status(401).json({ message: 'User not authenticated to create this transaction.' });
        }
        
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Could not find this transaction.' });
        }
        transaction.status = 'canceled';
        transaction.updatedAt = Date.now();
        await transaction.save();
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};