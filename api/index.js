// api/index.js
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public'))); // Adjust the path for static files

io.on('connection', (socket) => {
    console.log('connected');

    socket.on('send-location', (data) => {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        io.emit('user-gone', socket.id);
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

// Export the server as a module for Vercel to use as a serverless function
module.exports = server;
