var app = require('express').createServer();
var io = require('socket.io').listen(app);

io.configure(function() {
  io.set('transports', ['websocket']);
});

var setupApp = require('./lib/server').setup;
var setupSockets = require('./lib/sockets').setup;

setupApp(app);
setupSockets(io);

app.listen(80);
