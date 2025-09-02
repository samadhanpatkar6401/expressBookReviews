const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Add this to your general.js file
public_users.get('/async-await-isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    try {
        const book = await getBookByISBN(isbn);
        return res.status(200).json(book);
    } catch (err) {
        return res.status(404).json({message: err.message});
    }
});

// Async function to get book by ISBN using Promises
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        // Simulate async operation with setTimeout
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        }, 1000); // 1 second delay to simulate async operation
    });
}

// Task 12: Search books by author using Promises
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const booksByAuthor = [];
            const searchTerm = author.toLowerCase();
            
            for (let isbn in books) {
                if (books[isbn].author.toLowerCase().includes(searchTerm)) {
                    booksByAuthor.push({isbn: isbn, ...books[isbn]});
                }
            }
            
            if (booksByAuthor.length > 0) {
                resolve(booksByAuthor);
            } else {
                reject(new Error("No books found by this author"));
            }
        }, 1000);
    });
}
// Task 12: Search by Author using Promises
public_users.get('/promise-author/:author', function (req, res) {
    const author = req.params.author;
    
    getBooksByAuthor(author)
        .then(books => {
            return res.status(200).json(books);
        })
        .catch(err => {
            return res.status(404).json({message: err.message});
        });
});

// Task 13: Search books by title using Promises
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const booksByTitle = [];
            const searchTerm = title.toLowerCase();
            
            for (let isbn in books) {
                if (books[isbn].title.toLowerCase().includes(searchTerm)) {
                    booksByTitle.push({isbn: isbn, ...books[isbn]});
                }
            }
            
            if (booksByTitle.length > 0) {
                resolve(booksByTitle);
            } else {
                reject(new Error("No books found with this title"));
            }
        }, 1000);
    });
}

// Task 13: Search by Title using Promises
public_users.get('/promise-title/:title', function (req, res) {
    const title = req.params.title;
    
    getBooksByTitle(title)
        .then(books => {
            return res.status(200).json(books);
        })
        .catch(err => {
            return res.status(404).json({message: err.message});
        });
});

// Task 11: Get book by ISBN using Promises
public_users.get('/promise-isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    getBookByISBN(isbn)
        .then(book => {
            return res.status(200).json(book);
        })
        .catch(err => {
            return res.status(404).json({message: err.message});
        });
});

// Async function to get all books using callback
function getAllBooks(callback) {
    // Simulate async operation with setTimeout
    setTimeout(() => {
        callback(null, books);
    }, 1000); // 1 second delay to simulate async operation
}

// Task 10: Get all books using async callback function
public_users.get('/async-all', function (req, res) {
    getAllBooks((err, booksData) => {
        if (err) {
            return res.status(500).json({message: "Error fetching books"});
        }
        return res.status(200).json(JSON.stringify(booksData, null, 2));
    });
});

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    if (isValid(username)) {
        return res.status(400).json({message: "Username already exists"});
    }

    users.push({username: username, password: password});
    return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = [];
    
    for (let isbn in books) {
        if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
            booksByAuthor.push({isbn: isbn, ...books[isbn]});
        }
    }
    
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({message: "No books found by this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];
    
    for (let isbn in books) {
        if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
            booksByTitle.push({isbn: isbn, ...books[isbn]});
        }
    }
    
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({message: "No books found with this title"});
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({message: "Book or reviews not found"});
    }
});

// Add a book review
public_users.post('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const { review } = req.body;
    
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    
    if (!review) {
        return res.status(400).json({message: "Review text is required"});
    }
    
    // For public users, we can use a simple approach
    // In a real app, you'd use the authenticated user's username
    const reviewId = Date.now().toString(); // Generate unique ID
    
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    
    books[isbn].reviews[reviewId] = review;
    
    return res.status(201).json({
        message: "Review added successfully",
        reviewId: reviewId,
        review: review
    });
});

// Modify a book review
public_users.put('/review/:isbn/:reviewId', function (req, res) {
    const isbn = req.params.isbn;
    const reviewId = req.params.reviewId;
    const { review } = req.body;
    
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    
    if (!books[isbn].reviews || !books[isbn].reviews[reviewId]) {
        return res.status(404).json({message: "Review not found"});
    }
    
    if (!review) {
        return res.status(400).json({message: "Review text is required"});
    }
    
    books[isbn].reviews[reviewId] = review;
    
    return res.status(200).json({
        message: "Review updated successfully",
        reviewId: reviewId,
        review: review
    });
});

// Delete a book review
public_users.delete('/review/:isbn/:reviewId', function (req, res) {
    const isbn = req.params.isbn;
    const reviewId = req.params.reviewId;
    
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    
    if (!books[isbn].reviews || !books[isbn].reviews[reviewId]) {
        return res.status(404).json({message: "Review not found"});
    }
    
    delete books[isbn].reviews[reviewId];
    
    return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.general = public_users;