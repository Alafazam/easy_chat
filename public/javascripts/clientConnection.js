(function() {
    var loggedIn = false;

    var colors = ["red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange"];
    
    function getColor () {
        var color = colors[Math.floor(Math.random() * colors.length)];
        var shade = " darken-" + getColorShade();
        return color + shade; 
    }
    function getColorShade (argument) {
        return Math.floor(Math.random() * 3) + 1;
    }
    var userColors = [];
    
    function genrateColor (username) {
        userColors[username] = getColor();
    }

    // $('.modal-trigger').leanModal();

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
    function getUsername() {}

    function validateUsername(username) {
        if (username && username.length > 2 && username.length <= 15 && username != '' && /^[a-zA-Z_]+$/.test(username))
            return true;
        else false;
    }

    var msg_box = document.getElementById('m');


    var global_username = '';
    var namespace = ":"+ window.location.port + '/';
    var paths = window.location.pathname.split('/');
    
    if(paths.length === 3){
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
        if (!$('#m').val() || $('#m').val() == '')
            return false;

        var message = escapeHtml($('#m').val());

        socket.emit('message', message);

        $('#m').val('');
        return false;
    });


    socket.on('message', function(data) {
        if (!loggedIn)
            return;
        console.log("message recieved");

        var colr = userColors[data.username];

        var d = new Date();
        var current_time = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ":" +
            (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + " " +
            (d.getHours() < 12 ? "AM" : "PM");
        var li = document.createElement("li");

        classie.add(li, "row message_li animated bounceInLeft tada col s7");

        var message_u = document.createElement("span");
        message_u.appendChild(document.createTextNode(data.username));
        classie.add(message_u, "col message_u");

        var message_ts = document.createElement("span");
        message_ts.appendChild(document.createTextNode(current_time));
        classie.add(message_ts, "col s2 message_ts");

        var message_t = document.createElement("span");
        message_t.appendChild(document.createTextNode(data.msg));
        emojify.run(message_t);
        classie.add(message_t, "col s8 message_t");
        // + " " + colr
        li.appendChild(message_u);
        li.appendChild(message_ts);
        li.appendChild(message_t);

        if (data.username == global_username) {
            classie.add(li, "zoomInLeft offset-s5");
            classie.add(message_t, "offset-s4 right-align");
            classie.add(message_u, "s10 right-align")
        } else {
            classie.add(li, "zoomInRight");
        }

        message_window.appendChild(li);

        $("html, body").animate({
            scrollTop: $(document).height()
        }, 100);
    });

    socket.on('joined', function(data) {
        if (!loggedIn)
            return;
        Materialize.toast(data.username + " has joined.", 2000);
        genrateColor(data.username);
    });

    socket.on('back', function(data) {
        if (!loggedIn)
            return;
        Materialize.toast(data.username + " is back.", 2000);
    });


    // socket.on('left', function(data) {
    //      Materialize.toast(data.username + " has left.", 4000);
    // });

    socket.on('request login', function(data) {
        if (loggedIn)
            return;

        $('#modal1').openModal({
            dismissible: false,
            complete: function() {
                global_username = escapeHtml($('#username.validate')[0].value);
                
                socket.emit('username', {
                    username: global_username
                });
                loggedIn = true;
                console.log("looged int");
            }
        });
    });

    socket.on('his username is', function(data) {
        global_username = data.username;
        loggedIn = true;
        console.log("retrived username from exsiting sesison");
    });


})();
