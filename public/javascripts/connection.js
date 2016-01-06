
(function(){

// crazy way of eascaping
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };


  var msg_box = document.getElementById('m');


  var username = '';
  var socket = io();
  var message_window = document.getElementById('messages-window'); 
  $('form').submit(function(){
    if(!$('#m').val()||$('#m').val() == '')
      return false;

    socket.emit('message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('message', function(data){
    var li = document.createElement("li");

    classie.add(li,"message_li animated bounceInLeft tada");

    var message_u = document.createElement("span");
    message_u.appendChild(document.createTextNode(data.username));
    classie.add(message_u,"messages message_u");

    var message_ts = document.createElement("span");
    message_ts.appendChild(document.createTextNode('12:30 PM'));
    classie.add(message_ts,"messages message_ts");

    var message_t = document.createElement("span");
    message_t.appendChild(document.createTextNode(data.msg));
    classie.add(message_t,"messages message_t");

    li.appendChild(message_u);
    li.appendChild(message_ts);
    li.appendChild(message_t);
    if(data.username == username){
      classie.add(li,"right");
      classie.add(message_t,"right");
    }
    message_window.appendChild(li);
  });

  socket.on('joined', function (data) {
    $.notify(data.username + " has joined.", "info");
  });

  socket.on('left', function (data) {
    $.notify(data.username + " has left.", "info");
  });

  socket.on('request login', function(data){
    id = data.id;
    username = prompt('please enter your usename') || 'newUser';
    socket.emit('username',{'username':username,'id':id});
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

