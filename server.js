const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
let users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
  });
  
app.use((req, res) => {
    res.status(404).send('404 not found...');
})
  
const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
    socket.on('newUser', (newUser) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        users.push({name: newUser.author, id: socket.id});
        socket.broadcast.emit('message', {author: 'ChatBot', content: newUser.author + ' has joined the convo'});
      })
    console.log('New client! Its id – ' + socket.id);
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
      });
    socket.on('disconnect', () => {
        removedUser = users.find(user => user.id === socket.id);
        socket.broadcast.emit('message', {author: 'ChatBot', content: removedUser.name + ' has left the convo'});
        users = users.filter(user => user.id !== socket.id);
        console.log('users in the chat', users);
    });
  });