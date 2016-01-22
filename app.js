
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var chatroom = require('./routes/chatroom');
// var profile = require('routes/profile');

var http = require('http');
var path = require('path');
var connection = require('./connection');
// var rooms = require('./rooms');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var app = express();

// all environments
app.set('port', server_port || process.env.PORT || 3000);
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


// app.locals.rooms = ["one","two"];

app.set("rooms",["one","two"]);

app.get('/', routes.index);
app.use('/chatroom', chatroom);


// app.get('/chatroom/list', chatroom.chatroom);

// app.get('/chatroom/:roomName', chatroom.chatroom);



// app.get('/users', user.list);

var server = http.createServer(app)
var io = require("socket.io").listen(server);
var connections = [];
var numberOfUsers = 0;



server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});

io.on('connection',connection.userConnection);


// rooms.P();

// var t = new rooms();