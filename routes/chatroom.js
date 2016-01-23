var random_names = require('../random_names');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('chatroom',{name: random_names()});
    console.log(req.app.get("rooms")); 
});


router.get('/:roomName',  function(req, res){
	// var roomName = req.params.roomName;
    res.render('chatroom',{name: random_names()});
	console.log(req);
});

module.exports = router;
