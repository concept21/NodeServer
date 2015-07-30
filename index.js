var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var chat = io.of('/chat')

server.listen(3000, function(){
  console.log('App listening at http://localhost:3000/');
});

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

//Chat socket
chat.on('connection', function (socket) {
    console.log('user connected to chat');

    socket.on('send msg', function(data){
      console.log('msg received')
      chat.emit('get msg', data)
    })

    socket.on('disconnect', function(){
      console.log('user disconnected from chat');
    })
});
//Default socket
io.on('connection', function(socket){

  var socketId = socket.id
  console.log('Socket ' + socketId +' connected')

  //send notification to all clients
  socket.emit('new', socketId)

  socket.on('disconnect', function(){
    console.log('Socket ' + socket.id +' disconnected')
  });
});