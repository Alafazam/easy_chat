var _ = require('lodash');

var usernamesOccupied = [];

function User(socket) {
    this._socket = socket;
    this.id = socket.id;
    this.name = '';
    this.session = socket.handshake.session;
    this.sessionInitiated = false;
    this.inNamespace = socket.id.split('#')[0];

    for (var t in socket) {
        this[t] = socket[t];
    }

    console.log('connected ' + socket.id);

    Janta[this.inNamespace].push(this.id);
    console.log(this.id + " added to namespace " + this.inNamespace);
    this.__init__();
};

User.prototype.emit = function(event, data) {
    this._socket.emit(event, data);
}
User.prototype._broadcast = function(event, data) {
    this._socket.broadcast.emit(event, data);
}

User.prototype._onMessageRecieved = function(data) {
    this._broadcast('message', {
        'username': data.username,
        'message': data.message
    });
    this.emit('recieved', {
        'username': data.username,
        '_hash': data._hash
    });
}

User.prototype.checkSession = function(data) {
    // check if session is present
    if (!Sessions[this.session.id]) {
        // console.log("Request login");
        this.emit('request login', {
            'id': this.id
        });
        return;
    }
    //Session is runnning.
    this.sessionInit({
        restore: true
    });

    this.emit('welcome back', {
        'username': this.name
    });
    this._broadcast('back', {
        'username': this.name
    });

    console.log("Session restored for " + this.name);
};

User.prototype.setUsername = function(data) {
    // if name exit again ask for a new name
    // console.log("nameExists(data.name) " + nameExists(data.username));
    if (nameExists(data.username)) {
        this.emit('request login', { exists: true });
        return;
    }
    // username is confirmed
    this.name = data.username;
    usernamesOccupied.push(data.username);

    // create a new session for this user
    this.sessionInit({
        restore: false
    });
    // this.currentroom = new Room(this);
};

User.prototype.sessionInit = function(param) {

    // if !restore create new
    if (!param.restore) {
        // add to global
        Sessions[this.session.id] = this.name;
        this.session.sockets = [];
        this.session.username = this.name;
        this._broadcast('joined', {
            username: this.name
        });
    } else {
        this.name = this.session.username;
    }

    // add the new socket to session sockets
    this.session.sockets.push(this.id);

    this.emit('username', {
        'username': this.name,
        'users_online': usernamesOccupied
    });
    this.sessionInitiated = true;
    // update
    this.session.save();
};



User.prototype.__init__ = function() {
    this._socket.on('setUsername', (function(data) {
        this.setUsername(data);
        console.log(data);
    }).bind(this));

    this._socket.on('message', (function(data) {
        console.log(this.name + " : " + data.message);
        this._onMessageRecieved(data);
    }).bind(this));

    this._socket.on('disconnect', (function(data) {
        this.udisconnect(data);
    }).bind(this));
};


User.prototype.udisconnect = function(data) {
    if(!this.sessionInitiated)
        return;

    for(var i = this.session.sockets.length-1; i > -1; i--){
        if (this.session.sockets[i] === this.id){
            this.session.sockets.splice(i, 1);
        }
    }

    if(this.inNamespace != '/'){
        // console.log("this.inNamespace " + this.inNamespace);
        // console.log("142 :" + _.contains(Janta[this.inNamespace], this.id));
        // console.log(Janta[this.inNamespace]);

        if(_.contains(Janta[this.inNamespace], this.id)){
            var pos = Janta[this.inNamespace].indexOf(this.id);
            Janta[this.inNamespace].splice(pos, 1);
        }
        if(Janta[this.inNamespace].length == 0){
            // no one is in this namespace
            RoomNames = _.remove(RoomNames, this.inNamespace.split('/')[1]);
            delete Janta[this.inNamespace];

        }
    }

    if(this.session){this.session.save()};
    console.log("disconnect " + this.id);

};


function nameExists(name) {
    // _.some(connectionList, function(item) {return item.username == username})
    return _.contains(usernamesOccupied, name);
};

module.exports = User;
