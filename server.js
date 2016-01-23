var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');



var routes = require('./routes/index');
var user = require('./routes/user');
var chatroom = require('./routes/chatroom');
// var profile = require('routes/profile');

var connection = require('./connection');
// var rooms = require('./rooms');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var app = express();

// all environments
app.set('port', server_port || process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.locals.rooms = ["one","two"];

app.get('/', routes);
app.use('/chatroom', chatroom);


// app.get('/chatroom/list', chatroom.chatroom);

// app.get('/chatroom/:roomName', chatroom.chatroom);



// app.get('/users', user.list);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




var server = http.createServer(app)
var io = require("socket.io").listen(server);
var connections = [];
var numberOfUsers = 0;



server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});

io.on('connection',connection.userConnection);
