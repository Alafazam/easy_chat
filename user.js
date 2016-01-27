// user.js

var connectionList = [];
var numberOfUsers = 0;
var running_session = [];



var User = function(socket) {
    this._socket = socket;
    this.id = socket.id;
    this.name = '';

    for (var t in socket) {
        this[t] = socket[t];
    }

    this.__init__();
};

User.prototype.emit = function(event, data) {
    this._socket.emit(event, data);
}

User.prototype.broadcast = function(event, data) {
    event = event || 'message';
    this._socket.broadcast.emit(event, data);
}

User.prototype.setUsername = function(data) {
    // this.name = data.username;
    // this.broadcast('notify user joined', {
    //     username: this.name,
    //     timestamp: 'random time'
    // });

    if (this.handshake.session.username)
        return; //session exsits.

    var sess = this.handshake.session;
    var username = data.username;
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
    this.on('username', (function (data) {
        this.setUsername(data);
    }).bind(this));

    this.on('message', (function (data) {
        this.broadcast(data);
    }).bind(this));

    this.on('disconnect', (function (data) {
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
