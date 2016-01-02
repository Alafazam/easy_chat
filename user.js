// doo.js
var User = function(socket) {
	this._socket = socket;
	this.id = socket.id;
	this.name = '';
};

User.prototype.emit = function(event,data) {
	this._socket.emit(event,data);
}

User.prototype.broadcast = function(event='message',data) {
	event = event || 'message';	
	this._socket.broadcast.emit(event,data);
}

User.prototype.setUsername = function(data) {
	this.name = data.username;
	this.broadcast('notify user joined',{ username: this.name,
									 timestamp: 'random time'});

};

User.prototype.init = function() {
	this.on('username',this.setUsername);
	this.on('message',this.broadcast);
	this.on('disconnect',this.disconnect);
};


User.prototype.disconnect = function() {
	this.broadcast()
};

socket.username = '';


//  make use tell his name
socket.emit('request login', {
    'id': socket.id
});

// when we know who user is
socket.on('username', function(data) {
    socket.username = data.username;
    connectionList[numberOfUsers - 1] = {
        username: socket.username,
        id: socket.id
    };
    // notify others
    socket.broadcast.emit('update users', {
        status: 'joined',
        numberOfUsers: numberOfUsers,
        connectionList: connectionList,
        msg: socket.username + ' joined'
    });
})


socket.on('chat message', function(msg) {
    io.emit('chat message', {
        'username': socket.username,
        'msg': msg
    });
    console.log(socket.username + ' said ' + msg);
});


socket.on('disconnect', function() {
    console.log(socket.username + ' got disconnected');
    numberOfUsers--;
    socket.broadcast.emit('update users', {
        status: 'disconnect',
        numberOfUsers: numberOfUsers,
        msg: socket.username + ' got disconnected'
    });
});
module.exports = User;
