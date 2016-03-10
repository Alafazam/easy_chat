var _ = require('lodash');
var Room = require('./rooms');

var connectionList = [];
var numberOfUsers = 0;
var running_session = [];
var usernamesOccupied = [];
var User = function(socket) {
    this._socket = socket;
    this.id = socket.id;
    this.name = '';
    this.session = socket.handshake.session;


    this.rooms = [];
    this.connectionList = [];
    this.currentroom = this.id;

    for (var t in socket) {
        this[t] = socket[t];
    }
    console.log('calling init');
    this.__init__();
};

User.prototype.emit = function(event, data) {
    this._socket.emit(event, data);
}

User.prototype.ubroadcast = function(data) {
    // if (!data) {
        // data = uevent;
        // uevent = "message";
    // }
    // console.log("sending message");
    // this._socket.broadcast.emit(uevent, data);
    this._socket.broadcast.emit('message', {
        'username': this.name,
        'msg': data
    });
    this._socket.emit('message', {
        'username': this.name,
        'msg': data
    });

}

User.prototype.notifyClient = function(msg) {
    this.emit(msg, {
        'username': this.name
    });
    console.log("client notified of name: "+ this.name);
};

User.prototype.joinRoom = function(room) {
    this.currentroom = room;
    this._socket.join(room);
};


User.prototype.checkSession = function(data) {
    // check if session is present
    if (!_.contains(running_session, this.session.id)) {
        this.emit('request login', {
            'id': this.id
        });
        console.log("Request login");
        return;
    }
    // so session is runnning.
    this.sessionInit({
        restore: true
    });

    if (this.session.sockets.length > 1) {
        // already opened in another window.
        // just send username to client
        this.broadcast('back', {
            username: this.name
        });
        return;
    }
    console.log("session restored for " + this.name);
};

User.prototype.setUsername = function(data) {
    if (this.session.username)
        return; //session exsits.
    // if name exit again ask for a new name
    if (nameExists(data.name)) {
        this.emit('request login', {
            exists: true
        });
        return;
    }
    this.name = data.username;
    console.log(data.username);
    this.session.sockets = [];
    this.sessionInit({
        restore: true
    });
    // this.currentroom = new Room(this);
};

User.prototype.sessionInit = function(param) {

    if (!param.restore) {
        // create new
        running_session.push(this.session.id);
        this.broadcast('joined', {
            username: this.name
        });
    }

    this.session.uid = Date.now();
    this.session.windowOpen = true;
    this.session.sockets.push(this.id);
    this.notifyClient('username');

    connectionList.push({
        username: this.name,
        id: this.id,
        sessId: this.session.id,
        windowOpen: true,
        tStamp: this.session.uid
    });
    // update
    this.session.save();
};



User.prototype.__init__ = function() {
    this._socket.on('username', (function(data) {
        this.setUsername(data);
        console.log(data);
    }).bind(this));

    this._socket.on('message', (function(data) {
        console.log("got a message saying" + data);
        this.ubroadcast(data);
    }).bind(this));

    this._socket.on('disconnect', (function(data) {
        this.udisconnect(data);
    }).bind(this));
};


User.prototype.udisconnect = function() {
    // this.broadcast();
};


User.prototype.add_to_room = function(room) {

};




function nameExists(name) {
    // _.some(connectionList, function(item) {return item.username == username})
    return _.contains(usernamesOccupied, name);
};










// socket.username = '';


// //  make use tell his name
// socket.emit('request login', {
//     'id': socket.id
// });

// // when we know who user is
// socket.on('username', function(data) {
//     socket.username = data.username;
//     connectionList[numberOfUsers - 1] = {
//         username: socket.username,
//         id: socket.id
//     };
//     // notify others
//     socket.broadcast.emit('update users', {
//         status: 'joined',
//         numberOfUsers: numberOfUsers,
//         connectionList: connectionList,
//         msg: socket.username + ' joined'
//     });
// })


// socket.on('chat message', function(msg) {
//     io.emit('chat message', {
//         'username': socket.username,
//         'msg': msg
//     });
//     console.log(socket.username + ' said ' + msg);
// });


// socket.on('disconnect', function() {
//     console.log(socket.username + ' got disconnected');
//     numberOfUsers--;
//     socket.broadcast.emit('update users', {
//         status: 'disconnect',
//         numberOfUsers: numberOfUsers,
//         msg: socket.username + ' got disconnected'
//     });
// });





module.exports = User;
