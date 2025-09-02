const { getBookByISBN } = require('./router/general.js');

// Test the Promise-based ISBN search function
async function testPromiseISBN() {
    console.log("Testing Promise-based ISBN search...");
    
    // Test with valid ISBN
    try {
        console.log("Searching for ISBN 1...");
        const book = await getBookByISBN(1);
        console.log("Book found:", book.title, "by", book.author);
    } catch (error) {
        console.log("Error:", error.message);
    }
    
    // Test with invalid ISBN
    try {
        console.log("Searching for ISBN 999...");
        const book = await getBookByISBN(999);
        console.log("Book found:", book.title);
    } catch (error) {
        console.log("Error:", error.message);
    }
    
    // Test with then/catch syntax
    console.log("Testing with then/catch syntax...");
    getBookByISBN(2)
        .then(book => {
            console.log("Book found:", book.title, "by", book.author);
        })
        .catch(err => {
            console.log("Error:", err.message);
        });
}

testPromiseISBN();