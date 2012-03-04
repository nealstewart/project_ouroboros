var Crafty = Crafty;
var _ = _;

function renderPlayerList(playerList) {
  playerList = playerList || window.ouro.playerList;
  var playerListElement = $('#player_list');
  playerListElement.empty();

  _.each(playerList, function(playerInfo) {
    console.log("playerInfo", playerInfo);
    playerListElement.append('<li>'+playerInfo.name+'</li>');
  });
}

Crafty.scene('lobby', function() {
  var socket = window.ouro.socket;

  var text = Crafty.e("2D, DOM, Text")
  .attr({ 
    w: 100,
    x: (Crafty.viewport.width / 2) -
         (100 / 2), 
    y: 120 
  })
  .text("Lobby")
  .css({
    "color":"white",
    "text-align": "center"
  });

  var list = 
  Crafty.e('HTML')
  .attr({ 
    w: 100,
    x: (Crafty.viewport.width / 2) -
         (100 / 2), 
    y: 170 
  })
  .css({
    color: "white"
  })
  .replace('<div id="player_list"></div>');

  Crafty.e('HTML')
  .attr({
    w: 100,
    x: (Crafty.viewport.width / 2) -
         (100 / 2), 
    y: 60
  })
  .css({
    color: "white"
  })
  .replace('<input id="ready_btn" type="button" value="ready"/>');

  var readyBtn = $('#ready_btn');

  readyBtn.click(function() {
    socket.emit('ready', window.ouro.myId);
  });

  renderPlayerList();

  socket.on('playerList', renderPlayerList);

  socket.on('startGame', function() {
    Crafty.scene('main');
  });

}, function() {
  window.ouro.socket.removeListener('playerList', renderPlayerList);

  window.ouro.socket.removeAllListeners('startGame');
});
