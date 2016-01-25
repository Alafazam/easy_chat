var random_names = require('../random_names');
var express = require('express');
var router = express.Router();
var _ = require('lodash');

router.get('/', function(req, res, next) {
	console.log(req.app.locals.rooms);
    res.render('chatroom',{name: random_names()});
});


router.get('/:roomName',  function(req, res){
	var roomName = req.params.roomName;
	console.log(req.app.locals.rooms);
	console.log(roomName);
	console.log(_.includes(req.app.locals.rooms,roomName));


	if (_.includes(req.app.locals.rooms,roomName)) {
		res.render('chatroom',{name: random_names()});
	} else {
		res.redirect('/chatroom');
		console.log('client tried to access: ' + roomName);
	};
});

module.exports = router;


// socket.broadcast.to(data.room).emit('chatmessage', { client: chatClients[socket.id], message: data.message, room: data.room });