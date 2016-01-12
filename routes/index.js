
/*
 * GET home page.
 */


var random_names = require('../random_names');

exports.index = function(req, res){
  res.render('index',{name: random_names()});
};