var _ = require('lodash');
var User = require('./user')



var connectionList = [];
var numberOfUsers = 0;

exports.connectionList = connectionList;
exports.numberOfUsers = numberOfUsers;

exports.userConnection = function(socket) {
    numberOfUsers++;
    socket.username = '';

    //  make user tell his name
    socket.emit('request login', {
        'id': socket.id
    });

    // when we know who use is
    socket.on('username', function(data) {
        var username = data.username;
        var nameExists = _.some(connectionList, function(item) {
            return item.username == username;
        });
        if (nameExists) {
            socket.emit('usernameExist', {
                'username': username
            });
        } else {
            socket.username = data.username;
            connectionList[numberOfUsers - 1] = {
                username: socket.username,
                id: socket.id
            };
            // notify others
            socket.broadcast.emit('joined', {
                username: socket.username
            });
        }
    })


    socket.on('message', function(msg) {
        socket.broadcast.emit('message', {
            'username': socket.username,
            'msg': msg
        });
        socket.emit('message', {
            'username': socket.username,
            'msg': msg
        });
        console.log(socket.username + ' said ' + msg);
    });

    socket.on('start typing', function(msg) {
        socket.broadcast.emit('typing', {
            'username': msg.username,
            'id': msg.id
        });
        console.log(msg.username + ' is typing');
    });





    socket.on('disconnect', function() {
        console.log(socket.username + ' got disconnected');
        numberOfUsers--;
        socket.broadcast.emit('left', {
            username: socket.username
        });
    });


};
