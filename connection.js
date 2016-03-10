var _ = require('lodash');
var User = require('./user');


var connectionList = [];
var numberOfUsers = 0;
var running_session = [];


// var nsp = io.of('/namespace');

exports.userConnection = function(socket) {
    numberOfUsers++;
    socket.username = '';
    // socket.join("bogie");

    user = new User(socket);
    // user.__init__();
    user.checkSession();

    // if (_.contains(running_session, user.handshake.session.id)) { //  make user tell his name
    //     var sess = user.handshake.session;
    //     console.log("Session recoverd with id: " + sess.id + " and username: " + sess.username);

    //     if (!sess.windowOpen) {
    //         sess.uid = Date.now();
    //         sass.windowOpen = true;
    //         // notify others
    //         user.broadcast.emit('back', {
    //             username: sess.username
    //         });
    //     }

    //     user.username = sess.username;
    //     // send username to client
    //     user.emit('his username is', {
    //         'username': sess.username
    //     });
    //     // save connection in list
    //     connectionList.push({
    //         username: user.username,
    //         id: user.id,
    //         sessId: sess.id,
    //         windowOpen: true,
    //         tStamp: sess.uid
    //     });
    //     // update
    //     sess.save();
    // } else {
    //     user.emit('request login', {
    //         'id': user.id
    //     });
    //     console.log("session does not exists, ask user for new name");
    // }

    // when we know who use is
    // socket.on('username', function(data) {
    // });

    // socket.on('message', function(msg) {
    //     if (!socket.handshake.session.username) {
    //         console.log("session does not exsits");
    //         console.log(socket.handshake.session);
    //         return; //session exsits.
    //     }
    //     // console.log(msg);


    //     socket.broadcast.emit('message', {
    //         'username': socket.username,
    //         'msg': msg
    //     });

    //     socket.emit('message', {
    //         'username': socket.username,
    //         'msg': msg
    //     });

    //     // console.log(socket.username + ' said ' + msg);
    // });

    // socket.on('start typing', function(msg) {
    //     if (!socket.handshake.session.uid)
    //         return;

    //     socket.broadcast.emit('typing', {
    //         'username': msg.username,
    //         'id': msg.id
    //     });

    //     console.log(msg.username + ' is typing');
    // });


    // socket.on('disconnect', function() {
    //     if (!socket.username)
    //         return;

    //     // if (!socket.handshake.session.id)
    //     // return;

    //     // console.log(socket.username + ' got disconnected');
    //     numberOfUsers--;

    //     socket.broadcast.emit('left', {
    //         username: socket.username
    //     });

    //     _.pull(connectionList, {
    //         username: socket.username,
    //         id: socket.id,
    //         sess: socket.handshake.session.id
    //     });

    //     // _.pull(running_session, socket.handshake.session.id);
    //     // console.log("Session destroyed with uid: " + sess.uid + " and username: " + username);
    //     // socket.handshake.session.destroy();
    // });


};
