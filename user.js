var _ = require('lodash');

var running_session = [];
var usernamesOccupied = [];

var User = function(socket) {
    this._socket = socket;
    this.id = socket.id;
    this.name = '';
    this.session = socket.handshake.session;

    for (var t in socket) {
        this[t] = socket[t];
    }
    console.log('calling init');
    this.__init__();
};

User.prototype.emit = function(event, data) {
    this._socket.emit(event, data);
}
User.prototype._broadcast = function(event, data) {
    this._socket.broadcast.emit(event, data);
}

User.prototype._onMessageRecieved = function(data) {
    this._broadcast('message', {
        'username': data.username,
        'message': data.message
    });
    this.emit('recieved', {
        'username': data.username,
        '_hash': data._hash
    });
}

User.prototype.checkSession = function(data) {
    // check if session is present
    if (!_.contains(running_session, this.session.id)) {
        // console.log("Request login");
        this.emit('request login', {
            'id': this.id
        });
        return;
    }
    // so session is runnning.
    this.sessionInit({
        restore: true
    });

    this.emit('welcome back', {
        'username': this.name
    });
    this._broadcast('back', {
        'username': this.name
    });

    console.log("session restored for " + this.name);
};

User.prototype.setUsername = function(data) {
    // if name exit again ask for a new name
    // console.log("nameExists(data.name) " + nameExists(data.username));
    if (nameExists(data.username)) {
        this.emit('request login', { exists: true });
        return;
    }
    this.name = data.username;
    usernamesOccupied.push(data.username);
    this.session.sockets = [];
    this.sessionInit({
        restore: false
    });
    // this.currentroom = new Room(this);
};

User.prototype.sessionInit = function(param) {

    if (!param.restore) {
        // create new
        running_session.push(this.session.id);
        this._broadcast('joined', {
            username: this.name
        });
        this.session.username = this.name;
    } else {
        this.name = this.session.username;
    }

    this.session.uid = Date.now();
    this.session.windowOpen = true;
    this.session.sockets.push(this.id);
    this.emit('username', {
        'username': this.name,
        'users_online': usernamesOccupied
    });


    // pushing to global array
    UserConnections.push({
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
    this._socket.on('setUsername', (function(data) {
        this.setUsername(data);
        console.log(data);
    }).bind(this));

    this._socket.on('message', (function(data) {
        console.log("got a message saying: " + data.message);
        this._onMessageRecieved(data);
    }).bind(this));

    this._socket.on('disconnect', (function(data) {
        // this.udisconnect(data);
    }).bind(this));
};


User.prototype.udisconnect = function(data) {
    var _this = this;
    var timeoutId = setTimeout(function() { KILL_USER_SESSION(_this); }, 10000);
    console.log(timeoutId);
    // this.session.shouldStop = timeoutId;
    // update
    if(this.session){this.session.save()};
};


function nameExists(name) {
    // _.some(connectionList, function(item) {return item.username == username})
    return _.contains(usernamesOccupied, name);
};

function KILL_USER_SESSION(_this){
    var id = _this.id;
    _.remove(usernamesOccupied, _this.name);
    _.remove(running_session, _this.session.id);
    _.remove(UserConnections, function(n) {
        return n.id = id;
    });
    _this.session.destroy();
    console.log("session stopped for " + _this.name);
}








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
