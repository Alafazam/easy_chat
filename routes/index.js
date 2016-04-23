var random_names = require('../random_names');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{name: random_names(), availableRooms: RoomNames});
});

module.exports = router;
