var connection = require('./connection');

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 16; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
// name of file is actually a bit misleading, we are creating namespaces here

var room = function (name) {
	console.log("creating new room here");
	var me = this;
	if(name)
		this.name = name;
	else
		this.name = makeid();

	this._namespaces = io.of('/' + this.name);
	this._namespaces.use(ios(session));
	this._namespaces.on('connection',connection.userConnection);
	this.timeStamp = new Date().getTime();
	return this;
};
room.prototype = {
	get name() {
		return this.name;
	},
	get namespaces() {
		return this._namespaces;
	}
}



module.exports = room;
