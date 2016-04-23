var _ = require('lodash');
var User = require('./user');

exports.userConnection = function(socket) {
    if(!socket.username){
    	socket.username = '';
    }
    var user = new User(socket);
    user.checkSession();
};
