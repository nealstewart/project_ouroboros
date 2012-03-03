window.ouro = window.ouro || {};

var Crafty = Crafty;

window.ouro.assets = [
  "images/sprite.png", 
  "images/bg.png"
];

window.ouro.setupAssets = function() {
  Crafty.sprite(64, "images/sprite.png", {
    ship: [0,0],
    big: [1,0],
    medium: [2,0],
    small: [3,0]
  });
};
