(function() {
    var loggedIn = false;

    var colors = ["red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green", "light-green", "lime", "yellow", "amber", "orange", "deep-orange"];

    function getColor() {
        var color = colors[Math.floor(Math.random() * colors.length)];
        var shade = " darken-" + getColorShade();
        return color + shade;
    }

    function getColorShade(argument) {
        return Math.floor(Math.random() * 3) + 1;
    }
    var userColors = [];

    function genrateColor(username) {
        userColors[username] = getColor();
    }

    // $('.modal-trigger').leanModal();

    // crazy way of eascaping
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };

    function genhash(length) {
        var text = "";
        length = length || 10;
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
        for (var i = 0; length < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }


    function validateUsername(username) {
        if (username && username.length > 2 && username.length <= 15 && username != '' && /^[a-zA-Z_]+$/.test(username))
            return true;
        else false;
    }

    var msg_box = document.getElementById('m');


    var global_username = '';
    var namespace = ":" + window.location.port + '/';
    var paths = window.location.pathname.split('/');

    if (paths.length === 3) {
        namespace += paths[2];
    }
    var socket = io(namespace);
    // var socket = io('/bogie');
    // var socket = io(':8080/');
    // console.log(io);
    console.log("connnected to namespace: " + namespace);

    var id = null;

    var message_window = document.getElementById('messages-window');
    $('form').submit(function() {
        if (!loggedIn)
            return false;

        if (!$('#m').val() || $('#m').val() == '')
            return false;
        var message = escapeHtml($('#m').val());

        var data = {
            'username': global_username,
            'message': message,
            'hash': genhash(16)
        }

        socket.emit('message', data);
        _onMessage(data);
        $('#m').val('');
        return false;
    });


    function _onMessage(data) {
        console.log(data);
        // var colr = userColors[data.username];

        var d = new Date();
        var current_time = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ":" +
            (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + " " +
            (d.getHours() < 12 ? "AM" : "PM");
        // var li = document.createElement("li");

        // classie.add(li, "row message_li animated bounceInLeft tada col s7");

        // var message_u = document.createElement("span");
        // var message_a = document.createElement("a");
        // $(message_a).attr('href',"#");
        // message_a.appendChild(document.createTextNode(data.username));
        // message_u.appendChild(message_a);
        // classie.add(message_u, "col message_u");

        // var message_ts = document.createElement("span");
        // message_ts.appendChild(document.createTextNode(current_time));
        // classie.add(message_ts, "col s2 message_ts");

        // var message_t = document.createElement("span");
        // message_t.appendChild(document.createTextNode(data.message));
        // emojify.run(message_t);
        // classie.add(message_t, "col s8 message_t");
        // // + " " + colr
        // li.appendChild(message_u);
        // li.appendChild(message_ts);
        // li.appendChild(message_t);


        // message_window.appendChild(li);
        var message_window = document.getElementById('messages-window');
        var li = parseTemplate($("#messageTemplate").html(), {
            username: data.username,
            time: current_time,
            message: data.message
        });


        var t = $(li)[0];
        // console.log(t);
        if (data.username == global_username) {
            classie.add(t, "zoomInLeft offset-s5");
        } else {
            classie.add(t, "zoomInRight");
        }
        message_window.appendChild(t);
        $("html, body").animate({
            scrollTop: $(document).height()
        }, 100);
    }

    socket.on('message', function(data) {
        if (!loggedIn)
            return;

        console.log("message recieved");
        if (!loggedIn)
            return;
        _onMessage(data);
    });

    socket.on('joined', function(data) {
        if (!loggedIn)
            return;
        Materialize.toast(data.username + " has joined.", 2000);
        genrateColor(data.username);
    });

    socket.on('request login', function(data) {
        if (loggedIn)
            return;

        if (data.exists) {
            $('h4#question').text("This username exist !!, Please Choose Another");
        }

        $('#modal1').openModal({
            dismissible: false,
            complete: function() {
                _username = escapeHtml($('#username.validate')[0].value);
                console.log(_username);
                socket.emit('setUsername', {
                    username: _username
                });
                $("#m").focus();
            }
        });
    });

    socket.on('username', function(data) {
        global_username = data.username;
        loggedIn = true;
    });
    socket.on('welcome back', function(data) {
        global_username = data.username;
        loggedIn = true;
        Materialize.toast('Welcome back ' + data.username, 2000);
    });
    socket.on('back', function(data) {
        if (!loggedIn)
            return;

        if (global_username != data.username)
            Materialize.toast(data.username + " is back.", 2000);
    });


})();
