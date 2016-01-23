var _ = require('lodash');

var connectionList = [];
var numberOfUsers = 0;
var running_session = [];


exports.userConnection = function(socket) {
    numberOfUsers++;
    socket.username = '';

    if (_.contains(running_session, socket.handshake.session.id)) { //  make user tell his name 
        var sess = socket.handshake.session;
        console.log("Session recoverd with id: " + sess.id + " and username: " + sess.username);

        if (!sess.windowOpen) {
            sess.uid = Date.now();
            sass.windowOpen = true;

            // notify others
            socket.broadcast.emit('back', {
                username: sess.username
            });

        }

        socket.username = sess.username;

        // send username to client
        socket.emit('his username is', {
            'username': sess.username
        });


        // save connection in list 
        connectionList.push({
            username: socket.username,
            id: socket.id,
            sessId: sess.id,
            windowOpen: true,
            tStamp: sess.uid
        });


        // update
        sess.save();

    } else {

        socket.emit('request login', {
            'id': socket.id
        });

        // console.log(socket.handshake.session.id);
        console.log("session does not exists, ask user for new name");
    }


    // when we know who use is
    socket.on('username', function(data) {
        if (socket.handshake.session.username)
            return; //session exsits.

        var sess = socket.handshake.session;
        var username = data.username;
        console.log(username);

        // if name exit again ask for a new name
        if (_.some(connectionList, function(item) {
                return item.username == username
            }))
            socket.emit('request login', {
                exists: true
            });


        socket.username = username;

        connectionList.push({
            username: socket.username,
            id: socket.id,
            sess: sess.id,
            windowOpen: true,
            tStamp: sess.uid
        });


        if (sess.windowOpen)
            return;


        sess.windowOpen = true;
        sess.uid = Date.now();
        sess.username = username;

        running_session.push(socket.handshake.session.id);

        // notify others
        socket.broadcast.emit('joined', {
            username: socket.username
        });

        // update
        sess.save();
    });

    socket.on('message', function(msg) {
        if (!socket.handshake.session.username) {
            console.log("session does not exsits");
            console.log(socket.handshake.session);
            return; //session exsits.
        }
        // console.log(msg);


        socket.broadcast.emit('message', {
            'username': socket.username,
            'msg': msg
        });

        socket.emit('message', {
            'username': socket.username,
            'msg': msg
        });

        // console.log(socket.username + ' said ' + msg);
    });

    socket.on('start typing', function(msg) {
        if (!socket.handshake.session.uid)
            return;

        socket.broadcast.emit('typing', {
            'username': msg.username,
            'id': msg.id
        });

        console.log(msg.username + ' is typing');
    });





    socket.on('disconnect', function() {
        if (!socket.username)
            return;

        // if (!socket.handshake.session.id)
        // return;

        // console.log(socket.username + ' got disconnected');
        numberOfUsers--;

        socket.broadcast.emit('left', {
            username: socket.username
        });

        _.pull(connectionList, {
            username: socket.username,
            id: socket.id,
            sess: socket.handshake.session.id
        });

        // _.pull(running_session, socket.handshake.session.id);
        // console.log("Session destroyed with uid: " + sess.uid + " and username: " + username);
        // socket.handshake.session.destroy();

    });


};
