const http = require('http');
const app = require("./src/app");
const { initializeSocket } = require('./socket'); // Import socket logic
const connectToDb = require("./src/db/db");

const port = process.env.PORT || 4000;

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

connectToDb();

server.listen(port, () => {
    console.log(`Server is running on ${port} port with Socket.io enabled 🚀`);
});