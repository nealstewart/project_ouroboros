function setup(io) {

io.sockets.on('connection', function (socket) {
  socket.emit("blah");
  socket.on('KeyDown', function(data) {
    io.sockets.emit('KeyDown', data);
  });
  socket.on('KeyUp', function(data) {
    io.sockets.emit('KeyUp', data);
  });
});

}

exports.setup = setup;
