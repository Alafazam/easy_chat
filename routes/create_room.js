var express = require('express');
var router = express.Router();
var _ = require('lodash');
var connection = require('.././connection');
var Room = require('.././rooms');



router.get('/', function(req, res, next) {
	var room = Room();
	Rooms.push(room);
	RoomNames.push(room.name);
 	res.redirect('/chatroom/' + room.name);
});

module.exports = router;


// socket.broadcast.to(data.room).emit('chatmessage', { client: chatClients[socket.id], message: data.message, room: data.room });