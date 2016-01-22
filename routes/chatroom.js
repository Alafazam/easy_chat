
/*
 * GET chatroom page.
 */
var random_names = require('../random_names');

var express = require('express');  
var chatroom = express();  




chatroom.get('/',  function(req, res){
    res.render('chatroom',{name: random_names()});
    console.log(req.app.get("rooms")); 

});




chatroom.get('/:roomName',  function(req, res){
	// var roomName = req.params.roomName;
	console.log(req);
    res.render('chatroom',{name: random_names()});
});

module.exports = chatroom;  
