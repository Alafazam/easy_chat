var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Room = require('.././rooms');



router.get('/', function(req, res, next) {
	var chatroom = new Room();
	RoomNames.push(chatroom.name);
	Janta["/" + chatroom.name] = [];
	res.redirect('/chatroom/' + chatroom.name);
});

module.exports = router;


// socket.broadcast.to(data.room).emit('chatmessage', { client: chatClients[socket.id], message: data.message, room: data.room });