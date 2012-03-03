window.ouro = window.ouro || {};

var players = [];
var socket;
var player;
var firebullet;
var myId;
var score;

var Crafty = Crafty;
var _ = _;
var io = io;

function createPlayer(id, location) {
  var player = Crafty.e("2D, Canvas, ship, Controls, Collision")
  .attr({
    id: id,
    move: {
      left: false, right: false,
      up: false, down: false
    }, 
    xspeed: 0,
    yspeed: 0,
    decay: 0.9,
    x: Crafty.viewport.width / 2,
    y: Crafty.viewport.height / 2,
    score: 0
  })
  .origin("center")
  .bind("EnterFrame", function() {
    if(this.move.right) this.rotation += 5;
    if(this.move.left) this.rotation -= 5;

    //acceleration and movement vector
    var vx = Math.sin(this._rotation * Math.PI / 180) * 0.3,
    vy = Math.cos(this._rotation * Math.PI / 180) * 0.3;

    //if the move up is true, increment the y/xspeeds
    if(this.move.up) {
      this.yspeed -= vy;
      this.xspeed += vx;
    } else {
      //if released, slow down the ship
      this.xspeed *= this.decay;
      this.yspeed *= this.decay;
    }

    //move the ship by the x and y speeds or movement vector
    this.x += this.xspeed;
    this.y += this.yspeed;

    //if ship goes out of bounds, put him back
    if(this._x > Crafty.viewport.width) {
      this.x = -64;
    }
    if(this._x < -64) {
      this.x =  Crafty.viewport.width;
    }
    if(this._y > Crafty.viewport.height) {
      this.y = -64;
    }
    if(this._y < -64) {
      this.y = Crafty.viewport.height;
    }

    //if all asteroids are gone, start again with more
    /*if(asteroidCount <= 0) {
    initRocks(lastCount, lastCount * 2);
      }*/
  }).collision()
    .onHit("bullet", function(e) {
    //if hit by a bullet increment the score
    //player.score += 5;
    //score.text("Score: "+player.score);
    var bullet = e[0].obj;
    console.log('bullet', bullet);
    if (this.id != bullet.player_id) {
      bullet.destroy(); //destroy the bullet
      this.attr({
        move: {
          left: false, right: false,
          up: false, down: false
        }, 
        xspeed: 0,
        yspeed: 0,
        decay: 0.9,
        x: Crafty.viewport.width / 2,
        y: Crafty.viewport.height / 2
      });
      //createPlayer(player.id);
      var opponent = _.find(players, function(plr) {
        return plr.id == bullet.player_id;
      });
      opponent.score += 1;
      var newScore = '';
      for (var p in players) {
        newScore += ' player ' + players[p].id + ': ' + players[p].score;
      }
      score.text(newScore);
    }
  });

  if (id == myId) {
    player.bind("KeyDown", function(e) {
      var data = {};
      data.keyCode = e.keyCode;

      data.x = player._x;
      data.y = player._y;
      data.rotation = player._rotation;

      socket.emit('KeyDown', myId, data);

    }).bind("KeyUp", function(e) {
      var data = {};
      data.keyCode = e.keyCode;

      data.x = player._x;
      data.y = player._y;
      data.rotation = player._rotation;

      socket.emit('KeyUp', myId, data);
    });
  }

  player.collision();

  players.push(player);
}

$(document).ready(function() {
  Crafty.canvas.init();
  //init Crafty with FPS of 50 and create the canvas element

  //preload the needed assets
  Crafty.load(["images/sprite.png", "images/bg.png"], function() {
    Crafty.scene('start_menu');
    return;
    //splice the spritemap
    Crafty.sprite(64, "images/sprite.png", {
      ship: [0,0],
      big: [1,0],
      medium: [2,0],
      small: [3,0]
    });

    //start the main scene when loaded


    var socket = window.ouro.socket;

    socket.on('newPlayer', createPlayer);

    socket.on('KeyDown', function(id, data) {
      var player = _.find(players, function(plr) {
        return plr.id == id;
      });

      // TODO: remove this later
      if (!player) {
        createPlayer(id);
        player = _.find(players, function(plr) {
          return plr.id == id;
        });
      }

      player._x = data.x;
      player._y = data.y;
      player._rotation = data.rotation;

      //on keydown, set the move booleans
      if(data.keyCode === Crafty.keys.RIGHT_ARROW) {
        player.move.right = true;
      } else if(data.keyCode === Crafty.keys.LEFT_ARROW) {
        player.move.left = true;
      } else if(data.keyCode === Crafty.keys.UP_ARROW) {
        player.move.up = true;
      } else if(data.keyCode === Crafty.keys.SPACE) {
        //create a bullet entity
        firebullet(player);
      }
    });

    socket.on('KeyUp', function(id, data) {
      var player = _.find(players, function(plr) {
        return plr.id == id;
      });
      
      // TODO: remove this later
      if (!player) {
        createPlayer(id);
        player = _.find(players, function(plr) {
          return plr.id == id;
        });
      }

      player._x = data.x;
      player._y = data.y;
      player._rotation = data.rotation;

      //on key up, set the move booleans to false
      if(data.keyCode === Crafty.keys.RIGHT_ARROW) {
        player.move.right = false;
      } else if(data.keyCode === Crafty.keys.LEFT_ARROW) {
        player.move.left = false;
      } else if(data.keyCode === Crafty.keys.UP_ARROW) {
        player.move.up = false;
      }
    });
  });

  Crafty.scene("main", function() {
    Crafty.background("url('images/bg.png')");

    //score display
    score = Crafty.e("2D, DOM, Text")
    .text("Score: 0")
    .attr({x: Crafty.viewport.width - 300, y: Crafty.viewport.height - 50, w: 200, h:50})
    .css({color: "#fff"});

    //player entity

    firebullet = function(player) {
      var bullet = Crafty.e("2D, Canvas, Color, bullet")
      .attr({
        x: player._x - 4,
        y: player._y - 7,
        w: 2, 
        h: 5, 
        rotation: player._rotation, 
        xspeed: 20 * Math.sin(player._rotation / 57.3), 
        yspeed: 20 * Math.cos(player._rotation / 57.3)
      })
      .color("rgb(255, 0, 0)")
      .bind("EnterFrame", function() { 
        bullet.x += bullet.xspeed;
        bullet.y -= bullet.yspeed;

        //destroy if it goes out of bounds
        if(bullet._x > Crafty.viewport.width || bullet._x < 0 || bullet._y > Crafty.viewport.height || bullet._y < 0) {
          bullet.destroy();
        }
      });
      bullet.player_id = player.id;
    };

    /*//keep a count of asteroids
    var asteroidCount,
    lastCount;

    //Asteroid component
    Crafty.c("asteroid", {
    init: function() {
    this.origin("center");
    this.attr({
    x: Crafty.math.randomInt(0, Crafty.viewport.width), //give it random positions, rotation and speed
    y: Crafty.math.randomInt(0, Crafty.viewport.height),
    xspeed: Crafty.math.randomInt(1, 5), 
    yspeed: Crafty.math.randomInt(1, 5), 
    rspeed: Crafty.math.randomInt(-5, 5)
    }).bind("EnterFrame", function() {
    this.x += this.xspeed;
    this.y += this.yspeed;
    this.rotation += this.rspeed;

    if(this._x > Crafty.viewport.width) {
    this.x = -64;
    }
    if(this._x < -64) {
    this.x =  Crafty.viewport.width;
    }
    if(this._y > Crafty.viewport.height) {
    this.y = -64;
    }
    if(this._y < -64) {
    this.y = Crafty.viewport.height;
    }
    }).collision()
    .onHit("bullet", function(e) {
    //if hit by a bullet increment the score
    player.score += 5;
    score.text("Score: "+player.score);
    e[0].obj.destroy(); //destroy the bullet

    var size;
    //decide what size to make the asteroid
    if(this.has("big")) {
    this.removeComponent("big").addComponent("medium");
    size = "medium";
    } else if(this.has("medium")) {
    this.removeComponent("medium").addComponent("small");
    size = "small";
    } else if(this.has("small")) { //if the lowest size, delete self
    asteroidCount--;
    this.destroy();
    return;
    }

    var oldxspeed = this.xspeed;
    this.xspeed = -this.yspeed;
    this.yspeed = oldxspeed;

    asteroidCount++;
    //split into two asteroids by creating another asteroid
    Crafty.e("2D, Canvas, "+size+", Collision, asteroid").attr({x: this._x, y: this._y});
    });

    }
    });

    //function to fill the screen with asteroids by a random amount
    function initRocks(lower, upper) {
    var rocks = Crafty.math.randomInt(lower, upper);
    asteroidCount = rocks;
    lastCount = rocks;

    for(var i = 0; i < rocks; i++) {
    Crafty.e("2D, Canvas, big, Collision, asteroid");
    }
    }
    //first level has between 1 and 10 asteroids
    initRocks(1, 10);
*/
  });

});
