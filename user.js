var _ = require('lodash');

var connectionList = [];
var numberOfUsers = 0;
var running_session = [];



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

    this.__init__();
};

User.prototype.emit = function(event, data) {
    this._socket.emit(event, data);
}

User.prototype.broadcast = function(event, data) {
    if (!data) {
        data = event;
        event = "message";
    }
    this._socket.broadcast.emit(event, data);
}

User.prototype.notifyClient = function() {
    this.emit("his username is", {
        'username': this.name
    })
};

User.prototype.joinRoom = function(room) {
    this.currentroom = room;
    this._socket.join(room);
};

User.prototype.createSession = function(data) {
    if (!_.contains(running_session, this.session.id)) {
        this.emit('request login', {
            'id': this.id
        });
        console.log("Request login");
        return;
    }
    if (this.session.windowOpen) {
        // already opened in another window.
        // so dont assing him anything.
        // just send username to client
        this.notifyClient();
        this.broadcast('back', {
            username: this.name
        });
        return;
    }
    // restore session
    this.session.uid = Date.now();
    this.session.windowOpen = true;
    this.name = this.session.username;
    this.notifyClient();
    // save connection in list 
    connectionList.push({
        username: this.name,
        id: user.id,
        sessId: sess.id,
        windowOpen: true,
        tStamp: sess.uid
    });
    // update
    sess.save();
    console.log("session recovered for " + this.name);
};




User.prototype.setUsername = function(data) {
    if (this.session.username)
        return; //session exsits.

    var sess = this.session;
    this.name = data.username;
    console.log(username);

    // if name exit again ask for a new name
    if (_.some(connectionList, function(item) {
            return item.username == username
        }))
        this.emit('request login', {
            exists: true
        });

    this.username = username;


    connectionList.push({
        username: this.username,
        id: this.id,
        sess: sess.id,
        windowOpen: true,
        tStamp: sess.uid
    });


    if (sess.windowOpen)
        return;


    sess.windowOpen = true;
    sess.uid = Date.now();
    sess.username = username;

    running_session.push(this.handshake.session.id);

    // notify others
    this.broadcast.emit('joined', {
        username: this.username
    });

    // update
    sess.save();




};

User.prototype.__init__ = function() {
    this.on('username', (function(data) {
        this.setUsername(data);
    }).bind(this));

    this.on('message', (function(data) {
        this.broadcast(data);
    }).bind(this));

    this.on('disconnect', (function(data) {
        this.disconnect(data);
    }).bind(this));
};


User.prototype.disconnect = function() {
    this.broadcast();
};


User.prototype.add_to_room = function(room) {

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
