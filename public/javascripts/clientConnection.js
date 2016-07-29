var COLORS = ["red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green", "light-green", "lime", "yellow", "amber", "orange", "deep-orange"];


//Helper functions
// _______________

// Prevents input from having injected markup
function escapeHtml(str) {
    return $('<div/>').text(str).text();
};

// var $el = $('<li>').addClass('log').text(message);

function genrate_hash(length) {
    var text = "";
    length = length || 10;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function getColor(username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    var color = COLORS[index];
    var shade = " darken-" + Math.floor(Math.random() * 3) + 1;
    return color + shade;
}


function validateUsername(username) {
    if (username && username.length > 2 && username.length <= 15 && username != '' && /^[a-zA-Z_]+$/.test(username))
        return true;
    else false;
}



(function() {
    emojify.setConfig({
        img_dir: '.././images/emoji', // Directory for emoji images
    });
    var loggedIn = false;
    var FADE_TIME = 150; // ms
    var TYPING_TIMER_LENGTH = 400; // ms

    // Initialize variables
    var $window = $(window);
    var $usernameInput = $('#usernameInput'); // Input for username
    
    var msg_box = $('#inputMessage');
    var $inputMessage = $('#inputMessage'); // Input message input box

    var $messages = $('.messages'); // Messages area
    
    var $message_window = document.getElementById('messages-window');


    var globalUsername = '';
    var connected = false;
    var typing = false;
    var lastTypingTime;

    //connection to socket io
    var namespace = ":" + window.location.port + '/';
    var paths = window.location.pathname.split('/');
    if (paths.length === 3) {namespace += paths[2];}
    var socket = io(namespace);
    // var socket = io('/bogie');
    // var socket = io(':8080/');
    // console.log(io);
    console.log(paths);
    console.log("connnected to namespace: " + namespace);

    var id = null;

    $('form').submit(function() {
        if (!loggedIn)
            return false;

        if (!$inputMessage.val() || $inputMessage.val() == '')
            return false;
        var message = escapeHtml($inputMessage.val().trim());
        var data = {
            'username': globalUsername,
            'message': message,
            '_hash': genrate_hash(16)
        }
        socket.emit('message', data);
        _onMessage(data);
        $inputMessage.val('');
        return false;
    });


    function _onMessage(data) {
        console.log(data);
        // var colr = userColors[data.username];

        var d = new Date();
        var currentTime = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ":" +
            (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + " " +
            (d.getHours() < 12 ? "AM" : "PM");

        var li = parseTemplate($("#messageTemplate").html(), {
            username: data.username,
            time: currentTime,
            message: data.message,
            hash: data._hash
        });
        var t = $(li)[0];
        // console.log(t);
        emojify.run(t);
        
        if (data.username == globalUsername)
            classie.add(t, "zoomInLeft offset-l6");
        else
            classie.add(t, "zoomInRight");
        
        $(t).find("i#done").attr('id', data._hash);

        $message_window.appendChild(t);
        // messages_cache[data._hash] = t;

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

    socket.on('recieved', function(data) {
        if (!loggedIn)
            return;
        $('#' + data._hash).show();
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
                _username = escapeHtml($('#usernameInput')[0].value);
                console.log(_username);
                socket.emit('setUsername', {
                    username: _username
                });
                $inputMessage.focus();
            }
        });
    });

    socket.on('username', function(data) {
        globalUsername = data.username;
        loggedIn = true;
        // var e = $('#m')[0];
        // var ul = e.nextElementSibling;
        var e = $('div .awesomplete ul')[0];
        // console.log(e);
        emojify.run(e);

    });
    socket.on('welcome back', function(data) {
        globalUsername = data.username;
        loggedIn = true;
        Materialize.toast('Welcome ' + data.username, 2000);
    });
    socket.on('back', function(data) {
        if (!loggedIn)
            return;

        if (globalUsername != data.username)
            Materialize.toast(data.username + " is back.", 2000);
    });


})();
