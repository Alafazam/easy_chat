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
    function getUsername() {
    }

    function validateUsername(username) {
        if (username && username.length > 2 && username.length <= 15 && username != '' && /^[a-zA-Z_]+$/.test(username))
            return true;
        else false;
    }

    var msg_box = document.getElementById('m');


    var global_username = '';
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
        var d = new Date();
        var current_time = d.getHours()+":"+d.getMinutes();
        var li = document.createElement("li");

        classie.add(li, "message_li animated");

        var message_u = document.createElement("span");
        message_u.appendChild(document.createTextNode(data.username));
        classie.add(message_u, "messages message_u");

        var message_ts = document.createElement("span");
        message_ts.appendChild(document.createTextNode(current_time));
        classie.add(message_ts, "messages message_ts");

        var message_t = document.createElement("span");
        message_t.appendChild(document.createTextNode(data.msg));
        classie.add(message_t, "messages message_t");

        li.appendChild(message_u);
        li.appendChild(message_ts);
        li.appendChild(message_t);
        if (data.username == global_username) {
            classie.add(li, "zoomInLeft _right");
            classie.add(message_t, "_right");
        }else{
            classie.add(li, "zoomInRight");
        }

        message_window.appendChild(li);
    });

    socket.on('joined', function(data) {
        // $.notify(data.username + " has joined.", "info");
         Materialize.toast(data.username + " has joined.", 4000);
    });

    // socket.on('left', function(data) {
    //      Materialize.toast(data.username + " has left.", 4000);
    // });

    socket.on('request login', function(data) {

        $('#modal1').openModal({
            dismissible: false,
            complete: function() { 
                var userName = escapeHtml($('#username.validate')[0].value);
                // console.log(userName);
                global_username = userName;
                socket.emit('username', {username: userName});
            }
        });
    });


})();
