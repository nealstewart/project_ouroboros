function setup(io) {

io.sockets.on('connection', function (socket) {
  socket.emit("blah");
});

}

exports.setup = setup;
