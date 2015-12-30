var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connections = [];
var numberOfUsers = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
    numberOfUsers++;


    socket.username = '';

    socket.emit('request login',{'id':socket.id});

    socket.on('username',function (data) {
        socket.username = data.username;
        connections[numberOfUsers-1] = {
            username:socket.username,
            id:socket.id
        };
        socket.broadcast.emit('update users', {
          status:'joined',
          numberOfUsers: numberOfUsers,
          connections:connections,
          msg:socket.username+' joined'
        });
    })


    socket.on('chat message', function(msg){
        io.emit('chat message',{'username':socket.username,'msg':msg});
        console.log(socket.username + ' said ' + msg);
    });


    socket.on('disconnect', function(){
        console.log(socket.username +' got disconnected');
        numberOfUsers--;
        socket.broadcast.emit('update users', {
          status:'disconnect',
          numberOfUsers: numberOfUsers,
          msg:socket.username+' got disconnected'
        });
    });




});

http.listen(3000, function(){
    console.log('listening on *:3000');
});


// <!-- made by Alaf azam khan -->