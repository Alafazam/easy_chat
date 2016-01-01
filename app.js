
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app)
var io = require("socket.io").listen(server);
var connections = [];
var numberOfUsers = 0;

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



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