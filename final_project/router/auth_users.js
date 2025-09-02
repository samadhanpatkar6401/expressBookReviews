const express = require('express');
const jwt = require('jsonwebtoken');

let users = [];
let isValid = function(username) {
    return users.some(user => user.username === username);
}

const authenticated = express.Router();

// Login route
authenticated.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
        return res.status(400).json({message: "Username and password required"});
    }
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const accessToken = jwt.sign({username: username}, "access", {expiresIn: '1h'});
        req.session.authorization = {accessToken};
        return res.status(200).json({message: "Login successful"});
    } else {
        return res.status(401).json({message: "Invalid credentials"});
    }
});

// Logout route
authenticated.post("/logout", (req, res) => {
    req.session.destroy();
    return res.status(200).json({message: "Logout successful"});
});

// Add authenticated review endpoints
authenticated.post("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.session.authorization.username;
    
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    
    if (!review) {
        return res.status(400).json({message: "Review text is required"});
    }
    
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    
    // Use username as key to allow only one review per user per book
    books[isbn].reviews[username] = review;
    
    return res.status(201).json({
        message: "Review added successfully",
        username: username,
        review: review
    });
});

authenticated.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.session.authorization.username;
    
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({message: "Review not found"});
    }
    
    if (!review) {
        return res.status(400).json({message: "Review text is required"});
    }
    
    books[isbn].reviews[username] = review;
    
    return res.status(200).json({
        message: "Review updated successfully",
        username: username,
        review: review
    });
});

authenticated.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({message: "Review not found"});
    }
    
    delete books[isbn].reviews[username];
    
    return res.status(200).json({message: "Review deleted successfully"});
});
module.exports = {authenticated, users, isValid};