const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Could not find the requested user profile.' });
    }

    const books = await Book.find({ user: user });
    res.json({ user, books });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};