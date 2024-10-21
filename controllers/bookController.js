const Book = require('../models/Book');
const crypto = require('crypto');
const config = require('config');

const apiKey = config.get('apiKey');

// Add a book
exports.addBook = async (req, res) => {
    const { title, author, genre, condition, available } = req.body;
    try {
        const newBook = new Book({
            uuid: crypto.randomUUID(),
            user: req.user.id,
            title,
            author,
            genre,
            condition,
            available
        });
        const book = await newBook.save();
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

//  Edit a book
exports.editBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, genre, condition, available } = req.body;
    try {
        let book = await Book.findOne({ uuid: id});
        if (!book) return res.status(404).json({ msg: 'Book not found' });

        // Ensure user owns the book
        if (book.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        book = await Book.findOneAndUpdate(
            { uuid: id },
            { $set: { title, author, genre, condition, available } },
            { new: true }
        );

        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

//  Delete a book
exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        let book = await Book.findOne({ uuid: id});
        if (!book) return res.status(404).json({ msg: 'Book not found' });

        // Ensure user owns the book
        if (book.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Book.findOneAndDelete({ uuid: id});

        res.json({ msg: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all books
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

//  Get book by id
exports.getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findOne({ uuid: id});
        if (!book) {
            
            const bookWithObjectId = await Book.findById(id);
            bookWithObjectId.thumbnail = await fetchBookCoverUrl(bookWithObjectId.title, bookWithObjectId.author);
            res.json(bookWithObjectId);
            
            if (!bookWithObjectId) {
                return res.status(404).json({ msg: 'Could not find the requested book' });
            }
        } else {
            book.thumbnail = await fetchBookCoverUrl(book.title, book.author);
            res.json(book);
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

//  Get book cover image
const fetchBookCoverUrl = async (title, author) => {
    const query = `${title}+inauthor:${author}`;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const book = data.items[0];
            return book.volumeInfo.imageLinks.thumbnail;
        } else {
            throw new Error('No book found');
        }
    } catch (error) {
        console.error('Error fetching book cover:', error);
        return null;
    }
};

// Search books
exports.searchBooks = async (req, res) => {
    const { query } = req.query;
    try {
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};