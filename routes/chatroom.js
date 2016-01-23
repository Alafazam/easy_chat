var random_names = require('../random_names');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	console.log(req.app.locals.rooms);
    res.render('chatroom',{name: random_names()});

});


router.get('/:roomName',  function(req, res){
	var roomName = req.params.roomName;
    res.render('chatroom',{name: random_names()});
	console.log(req);
});

module.exports = router;
