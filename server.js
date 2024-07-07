const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const players = {};

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    players[socket.id] = { x: Math.random() * 500, y: Math.random() * 500 };

    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });

    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x += data.dx;
            players[socket.id].y += data.dy;
            io.emit('updatePlayers', players);
        }
    });

    io.emit('updatePlayers', players);
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
