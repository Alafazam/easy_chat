var random_names = require('../random_names');
var express = require('express');
var router = express.Router();
var _ = require('lodash');

router.get('/', function(req, res, next) {
    res.render('chatroom',{name: random_names()});
});

router.get('/:roomName',  function(req, res){
	var roomName = req.params.roomName;
	var room_found = false;

	for (var i = RoomNames.length - 1; i >= 0; i--) {
		if(RoomNames[i] == roomName)
			room_found = true;
	};

	if (room_found) {
		res.render('chatroom', {name: random_names()});
	} else {
		res.redirect('/chatroom');
		console.log('client tried to access: ' + roomName);
	};
});

module.exports = router;
