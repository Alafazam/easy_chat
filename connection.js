var connectionList = [];
var numberOfUsers = 0;

exports.connectionList = connectionList;
exports.numberOfUsers = numberOfUsers;

exports.userConnection = function (socket) {
	numberOfUsers++;
    socket.username = '';


	//  make use tell his name
    socket.emit('request login',{'id':socket.id});

	// when we know who use is
    socket.on('username',function (data) {
        socket.username = data.username;
        connectionList[numberOfUsers-1] = {
            username:socket.username,
            id:socket.id
        };
        // notify others
        socket.broadcast.emit('update users', {
          status:'joined',
          numberOfUsers: numberOfUsers,
          connectionList:connectionList,
          msg:socket.username+' joined'
        });
    })


    socket.on('chat message', function(msg){
        socket.broadcast.emit('chat message',{'username':socket.username,'msg':msg});
        socket.emit('chat message',{'username':socket.username,'msg':msg});
        console.log(socket.username + ' said ' + msg);
    });


    socket.on('disconnect', function(){
        console.log(socket.username +' got disconnected');
        numberOfUsers--;
        socket.broadcast.emit('update users', {
          status:'disconnect',
          numberOfUsers: numberOfUsers,
          msg:socket.username+' got disconnected'
        });
    });


};
