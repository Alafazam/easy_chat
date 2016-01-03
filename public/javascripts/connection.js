
(function(){

// crazy way of eascaping
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  var username = '';
  var socket = io();
  
  $('form').submit(function(){
    if(!$('#m').val()||$('#m').val() == '')
      return false;

    socket.emit('message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('message', function(data){
    if(data.username == username){
      data.username = '';
      $('#messages').append(   $('<li>').text(data.msg).addClass('right')   );    
    }else{
      $('#messages').append(   $('<li>').text(data.username + ": " + data.msg).addClass('animated bounceInLeft tada')   );
    }
  });

  socket.on('update users', function (data) {
    console.log(data);
  });

  socket.on('request login', function(data){
    id = data.id;
    username = prompt('please enter your usename') || 'newUser';
    socket.emit('username',{'username':username,'id':id});
  });

})();

