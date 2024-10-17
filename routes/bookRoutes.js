const express = require('express');
const router = express.Router();
const { addBook, editBook, deleteBook, getBooks, searchBooks, getBookById } = require('../controllers/bookController');
const auth = require('../middleware/auth');

// Add book route
router.post('/add', auth, addBook);

// Edit book route
router.put('/edit/:id', auth, editBook);

// Delete book route
router.delete('/delete/:id', auth, deleteBook);

// All books route
router.get('/', getBooks);

//  Get a book by ID
router.get('/:id', getBookById);

// Search books route
router.get('/search', searchBooks);

module.exports = router;