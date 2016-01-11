(function() {

    // crazy way of eascaping
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }


  // TODO ask username using modal window.
    function askUsername(again) {
        if (!again)
            return prompt('please enter your usename or cancel to use a random') || makeid();
        else if (again == 'exist')
            return prompt('username exist please enter another or cancel to use a random') || makeid();
        else if (again == 'invalid')
            return prompt('username is invalid please enter another or cancel to use a random') || makeid();
    }

    function validateUsername(username) {
        if (username && username.length > 2 && username.length <= 15 && username != '' && /^[a-zA-Z_]+$/.test(username))
            return username;
        else false;
    }

    var msg_box = document.getElementById('m');


    var username = '';
    var socket = io();
    var id = null;

    var message_window = document.getElementById('messages-window');
    $('form').submit(function() {
        if (!$('#m').val() || $('#m').val() == '')
            return false;

        socket.emit('message', escapeHtml($('#m').val()));
        $('#m').val('');
        return false;
    });

    socket.on('message', function(data) {
        var li = document.createElement("li");

        classie.add(li, "message_li animated bounceInLeft tada");

        var message_u = document.createElement("span");
        message_u.appendChild(document.createTextNode(data.username));
        classie.add(message_u, "messages message_u");

        var message_ts = document.createElement("span");
        message_ts.appendChild(document.createTextNode('12:30 PM'));
        classie.add(message_ts, "messages message_ts");

        var message_t = document.createElement("span");
        message_t.appendChild(document.createTextNode(data.msg));
        classie.add(message_t, "messages message_t");

        li.appendChild(message_u);
        li.appendChild(message_ts);
        li.appendChild(message_t);
        if (data.username == username) {
            classie.add(li, "_right");
            classie.add(message_t, "_right");
        }
        message_window.appendChild(li);
    });

    socket.on('joined', function(data) {
        $.notify(data.username + " has joined.", "info");
    });

    socket.on('left', function(data) {
        $.notify(data.username + " has left.", "info");
    });

    socket.on('request login', function(data) {
        username = askUsername();
        while (!validateUsername(username)) {
            username = askUsername('invalid');
        }
        socket.emit('username', {
            'username': username,
        });
    });

    socket.on('usernameExist', function(data) {
      username = askUsername('exist');
        while (!validateUsername(username)) {
            username = askUsername('invalid');
        }
        socket.emit('username', {
            'username': username,
        });
    });


    // msg_box.onkeypress = function (e) {
    //   if((String.fromCharCode(e.which) || msg_box.value) && msg_box.value !== ' ' ){
    //     console.log('true');
    //     socket.emit('start typing',{'username':username,'id':id});
    //   }else{
    //       console.log('fasle');
    //     socket.emit('stop typing',{'username':username,'id':id});      
    //   }
    // }


})();
