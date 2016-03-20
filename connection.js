var _ = require('lodash');
var User = require('./user');


var connectionList = [];
var numberOfUsers = 0;
var running_session = [];


// var nsp = io.of('/namespace');

exports.userConnection = function(socket) {
    numberOfUsers++;
    socket.username = '';
    user = new User(socket);
    user.checkSession();
};
