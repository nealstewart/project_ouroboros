window.ouro = window.ouro || {};
window.ouro.myId = null;

var Crafty = Crafty;
var io = io;

var socket = window.ouro.socket = io.connect('http://localhost/', {});
socket.on('id', function(idToSet) {
  window.ouro.myId = idToSet;
});

Crafty.init();


//the loading screen that will display while our assets load
Crafty.scene("start_menu", function () {
  Crafty.background("#000");

  var text = Crafty.e("2D, DOM, Text").attr({ 
    w: 100,
    x: (Crafty.viewport.width / 2) -
         (100 / 2), 
    y: 120 
  })
  .text("Loading...")
  .css({
    "color":"white",
    "text-align": "center"
  });

  var blech = Crafty.e('HTML')
    .attr({
      w: 200,
      x: (Crafty.viewport.width / 2) -
            (200 / 2),
      y: 60
    })
    .css({
      color: "white"
    })
    .replace('<form><label>Name</label><input /></form>');

  $('form').submit(function(evt) {
    var name = this.value;

    socket.emit('register', name);

    evt.preventDefault();
  });

  Crafty.load(window.ouro.assets, function() {
    window.ouro.setupAssets();
    //splice the spritemap

    if (socket.socket.connected) {
      text.text("Loaded!");

    } else {
      socket.on('connect', function() {
        text.text("Loaded!");
      });
    }
  });


});
