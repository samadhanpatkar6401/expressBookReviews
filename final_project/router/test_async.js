const { general } = require('./router/general.js');

// Test the async callback function
function testAsyncCallback() {
    console.log("Testing async callback function...");
    console.log("Calling getAllBooks with callback...");
    
    // Mock req and res objects for testing
    const mockReq = {};
    const mockRes = {
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            console.log("Response received with status:", this.statusCode);
            console.log("Number of books:", Object.keys(data).length);
            return this;
        }
    };
    
    // Test the route directly
    const routeHandler = general.stack.find(layer => layer.route.path === '/async-all').route.stack[0].handle;
    routeHandler(mockReq, mockRes);
}

testAsyncCallback();