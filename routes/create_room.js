var express = require('express');
var router = express.Router();
var _ = require('lodash');
var connection = require('.././connection');

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 16; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}



router.get('/', function(req, res, next) {
	roomName = makeid();
	var nsp = io.of('/' + roomName);
	nsp.use(ios(session));
	nsp.on('connection',connection.userConnection);
	Rooms.push(roomName);
 	// res.send('new room created with name ' + roomName);
 	res.redirect('/chatroom/' + roomName);
});

module.exports = router;


// socket.broadcast.to(data.room).emit('chatmessage', { client: chatClients[socket.id], message: data.message, room: data.room });