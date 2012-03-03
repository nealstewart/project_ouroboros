var app = require('./lib/server');
var io = require('socket.io').listen(app);

io.configure(function() {
  io.set('transports', ['websocket']);
});

var setupSockets = require('./lib/sockets').setup;
setupSockets(io);

app.listen(80);
