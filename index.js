var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var chat = io.of('/chat')

var port = process.env.PORT || 3000;

server.listen(port, function(){
  console.log('App listening at http://localhost:3000/');
});

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var users = []

//Chat socket
chat.on('connection', function (socket) {
    console.log('user connected to chat');

    users.push(socket.id)
    chat.emit('get users', users)

    socket.on('send msg', function(data){
      console.log('msg received')
      chat.emit('get msg', data)
    })

    socket.on('disconnect', function(){

      var UserIndex = users.indexOf(socket.id)
      users.splice(UserIndex, 1)
      chat.emit('get users', users)

      console.log('user disconnected from chat');
    })
});
//Default socket
io.on('connection', function(socket){

  var socketId = socket.id
  console.log('Socket ' + socketId +' connected')

  socket.on('disconnect', function(){
    console.log('Socket ' + socket.id +' disconnected')
  });
});