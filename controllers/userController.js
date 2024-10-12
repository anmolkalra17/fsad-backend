const User = require('../models/User');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const transactions = await Transaction.find({ userId: req.user.id }).populate('bookId');
    res.json({ user, transactions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};