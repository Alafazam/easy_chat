var _ = require('lodash');

var connectionList = [];
var numberOfUsers = 0;


exports.userConnection = function(socket) {
    numberOfUsers++;
    socket.username = '';

    //  make user tell his name
    socket.emit('request login', {
        'id': socket.id
    });

    // when we know who use is
    socket.on('username', function(data) {
        var username = data.username;
        console.log(username);

        if(connectionList.length>1){
          var nameExists = _.some(connectionList, function(item) {
              return item.username == username;
          });
        }else{
          var nameExists = false;
        }
        
        if (nameExists) {
          socket.emit('request login',{
            exists: true
          });
        } else {
            socket.username = data.username;

            connectionList.push({
                username: socket.username,
                id: socket.id
            });
            // notify others
            socket.broadcast.emit('joined', {
                username: socket.username
            });
        }
    })

    socket.on('message', function(msg) {
        socket.broadcast.emit('message', {
            'username': socket.username,
            'msg': msg
        });
        socket.emit('message', {
            'username': socket.username,
            'msg': msg
        });
        console.log(socket.username + ' said ' + msg);
    });

    socket.on('start typing', function(msg) {
        socket.broadcast.emit('typing', {
            'username': msg.username,
            'id': msg.id
        });
        console.log(msg.username + ' is typing');
    });





    socket.on('disconnect', function() {
      if(!socket.username)
        return; 
      
        console.log(socket.username + ' got disconnected');
        numberOfUsers--;
        socket.broadcast.emit('left', {
            username: socket.username
        });
        _.pull(connectionList,{ username: socket.username,
                                id: socket.id});
    });


};
