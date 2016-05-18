var _ = require('lodash');
var User = require('./user');

exports.userConnection = function(socket) {
    var user = new User(socket);
    user.checkSession();
};
