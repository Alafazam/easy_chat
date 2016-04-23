var connection = require('./connection');

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 16; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
// name of file is actually a bit misleading, we are creating namespaces here

var room = function(name) {
    console.log("creating new room here");
    var me = this;
    if (name)
        this._name = name;
    else
        this._name = makeid();

    this._namespace = io.of('/' + this.name);
    this._namespace.use(ios(session));
    this._namespace.on('connection', connection.userConnection);
    this._timeStamp = new Date().getTime();
    console.log("room created");

};

room.prototype = {
    get name() {
        return this._name;
    },
    get namespace(){
    	return this._namespace;
    }
}



module.exports = room;
