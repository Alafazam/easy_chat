
/*
 * GET chatroom page.
 */

var random_names = require('../random_names');

exports.chatroom = function(req, res){
    res.render('chatroom',{name: random_names()});
};