function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

var rooms = []

function Room (owner,params) {
	console.log('new room');
	// todo add a random url here
	
	this.id = params.id || makeid() ;
	this.name = params.name || owner.name + "'s room";
	this.url = '';
	room.push(this);
	
	this.owner = owner.id;
	this.member = [];
	this.member.push(owner.id);
	
	this.usersConnected = 1;

}


Room.prototype.join = function(user) {
	
	if (!this.member.indexOf(user.id)) {
		this.member.push(user.id);
		this.usersConnected++;	
	}else{
		console.log('user:'+user.username + " is already in room:" + room.name);
	}


};


Room.prototype.leave = function(user) {
	
	if (this.member.indexOf(user.id)>-1) {
		index  = this.member.indexOf(user.id);
		this.member.splice(index,1);
	};
	
};

Room.prototype.getName = function  (argument) {
	return this.name;
};


Room.prototype.getUrl = function  (argument) {
	return this.url;
};



function getRoomByUrl (url) {
	var room = null;

	for (var i = 0; i < rooms.length; i++) {
		if(rooms[i].getUrl() === url){
			room = rooms[i];
			break;
		}
	};

	return room;
};

function getRoomByName (name) {
	var room = null;

	for (var i = 0; i < rooms.length; i++) {
		if(rooms[i].getName() === name){
			room = rooms[i];
			break;
		}
	};

	return room;
};



module.exports = Room;

module.exports.getRoomByUrl = getRoomByUrl;
module.exports.getRoomByName = getRoomByName;
