var _ = require('underscore');

function setup(io) {

var currentId = 0;
var players = [];

var gameInProgress = false;

function emitPlayerList() {
  io.sockets.emit('playerList', players);

  var allReady = _.all(players, function(plr) {
    return plr.ready;
  });

  if (allReady) {
    io.sockets.emit('startGame');
  }
}

io.sockets.on('connection', function (socket) {
  socket.on('disconnect', function() {
    players = _.reject(players, function(plr) {
      return plr.socket == socket;
    });

    emitPlayerList();
  });

  socket.on('ready', function(id) {
    var player = _.find(players, function(plr) {
      return plr.id == id;
    });

    player.ready = true;

    emitPlayerList();
  });

  socket.on('register', function(name) {
    var playerInfo = {
      id: currentId,
      name: name,
      ready: false,
      socket: socket,
      toJSON: function() {
        return {
          id: this.id,
          name: this.name,
          ready: this.ready
        };
      }
    };

    players.push(playerInfo);

    socket.emit('id', currentId);
    emitPlayerList();
    socket.emit('moveToLobby');

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
