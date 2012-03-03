function setup(io) {

var currentId = 0;

io.sockets.on('connection', function (socket) {
  socket.emit('id', currentId);

  io.sockets.emit('newPlayer', currentId);

  socket.on('KeyDown', function(id, data) {
    io.sockets.emit('KeyDown', id, data);
  });

  socket.on('KeyUp', function(id, data) {
    io.sockets.emit('KeyUp', id, data);
  });

  currentId++;
});

}

exports.setup = setup;
