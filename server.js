const express = require('express');
const app = express();
const server = require('http').Server(app);
const { Server } = require('socket.io');
const io = new Server(server);

const { v4: uuidv4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/getUserName?redirectTo=${uuidv4()}`);
});

app.get('/getUserName', (req, res) => {
    if (!req.query.redirectTo) return req.redirect('/');
    res.render('getUsername', { redirectTo: req.query.redirectTo });
});

app.get('/:room', (req, res) => {
    if (!req.query.userName)
        return res.redirect(`getUsername?redirectTo=${req.params.room}`);
    res.render('index', {
        roomId: req.params.room,
        userName: req.query.userName,
    });
});

io.on('connection', (socket) => {
    socket.on('joinRoom', (roomId, userName) => {
        console.log('join-room', roomId, userName);
        socket.join(roomId);
        io.to(roomId).emit('new user', userName);
    });

    socket.on('chat message', (userName, message, roomId) => {
        io.to(roomId).emit('chat message', userName, message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });

    console.log(socket.rooms);
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Listening port 3000');
});
