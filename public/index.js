var socket = io();

var chatgrid = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

const joinRoom = (roomId, username) => {
    socket.emit('joinRoom', roomId, username);
};

joinRoom(roomId, userName);
console.log(userName)

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', userName, input.value, roomId);
        input.value = '';
    }
});

socket.on('chat message', (username, message) => {
    createMessage(username, message);
});
socket.on('new user', (userName) => {
    console.log('New user on your channel: ', userName);
});

const createMessage = (username, message) => {
    var node = chatgrid.children['message-block'];
    var newMessage = node.cloneNode(true);
    newMessage.children['username'].textContent = `[${username}]:`;
    newMessage.children['message'].textContent = message;

    chatgrid.appendChild(newMessage);
};
