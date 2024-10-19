const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  thumbnail: {
    type: String
  }
});

module.exports = mongoose.model('Book', BookSchema);