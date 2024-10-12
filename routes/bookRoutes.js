const express = require('express');
const router = express.Router();
const { addBook, editBook, deleteBook, getBooks, searchBooks } = require('../controllers/bookController');
const auth = require('../middleware/auth');

// Add book route
router.post('/add', auth, addBook);

// Edit book route
router.put('/edit/:id', auth, editBook);

// Delete book route
router.delete('/delete/:id', auth, deleteBook);

// All books route
router.get('/', getBooks);

// Search books route
router.get('/search', searchBooks);

module.exports = router;