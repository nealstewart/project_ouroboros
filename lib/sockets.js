function setup(io) {

var currentId = 0;
var players = [];

io.sockets.on('connection', function (socket) {
  socket.on('register', function(name) {
    var playerInfo = {
      id: currentId,
      name: name
    };
    players.push(playerInfo);

    socket.emit('id', currentId);
    io.sockets.emit('newPlayer', playerInfo);

    currentId++;
  });

  socket.on('KeyDown', function(id, data) {
    io.sockets.emit('KeyDown', id, data);
  });

  socket.on('KeyUp', function(id, data) {
    io.sockets.emit('KeyUp', id, data);
  });

});

}

exports.setup = setup;
