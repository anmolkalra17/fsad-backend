const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const books = await Book.find({ user: user });
    const transactions = await Transaction.find({ user: user }).populate('bookId');

    res.json({ user, books, transactions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};