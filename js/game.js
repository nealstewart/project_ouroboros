window.ouro = window.ouro || {};

var players = [];
var firebullet;
var score;

var Crafty = Crafty;
var _ = _;
var io = io;

var generalComponents = "2D, Canvas, Controls, Collision, SpriteAnimation";

var typeSprites = {
  boob: "BoobSprite",
  teeth: "TeethSprite",
  eye: "EyeSprite"
};

var typeBulletSprites = {
  boob: "BoobGunSpitSprite",
  eye: "EyeLaserSprite"
};

var typeOrigin = {
  eye: "center",
  boob: "center",
  teeth: "top"
};

function degToRad(deg) {
  return deg / 180 * Math.PI;
}

var typeBulletRadAdjustments = {
  boob: 0.08,
  eye: 0.15
};

var typeBulletHeightAdjustment = {
  boob: 70,
  eye: -30
};

function fireBullet(player) {
  var bulletType = typeBulletSprites[player.type];

  var rec = player.mbr();

  var centerX = rec._w / 2 + rec._x;
  var centerY = rec._h / 2 + rec._y;

  var playerRotationRads = degToRad(player._rotation);

  var typeHeightAdjustment = typeBulletHeightAdjustment[player.type];

  var heightAdjustment = player._h / 2 + typeHeightAdjustment;

  var typeRadAdjustment = typeBulletRadAdjustments[player.type];

  var xAdjustment = Math.sin(playerRotationRads - typeRadAdjustment) * heightAdjustment;
  var yAdjustment = -Math.cos(playerRotationRads - typeRadAdjustment) * heightAdjustment;

  var playerRotation = player._rotation;

  var bullet = Crafty.e("2D, Canvas, Sprite, " + bulletType)
  .attr({
    x: centerX + xAdjustment,
    y: centerY + yAdjustment,
    z: player._z + 1,
    rotation: playerRotation,
    xspeed: 20 * Math.sin(player._rotation / 57.3), 
    yspeed: 20 * Math.cos(player._rotation / 57.3)
  })
  .bind("EnterFrame", function() { 
    bullet.x += bullet.xspeed;
    bullet.y -= bullet.yspeed;

    //destroy if it goes out of bounds
    if(bullet._x > Crafty.viewport.width || bullet._x < 0 || bullet._y > Crafty.viewport.height || bullet._y < 0) {
      bullet.destroy();
    }
  });



  bullet.player_id = player.id;
}

function createPlayer(playerInfo) {
  var socket = window.ouro.socket;
  playerInfo.type = "boob";

  var sprite = typeSprites[playerInfo.type];

  var origin = typeOrigin[playerInfo.type];

  var player = Crafty.e("2D, Canvas, Controls, Collision, SpriteAnimation, " + sprite)
  .attr({
    id: playerInfo.id,
    name: playerInfo.name,
    type: playerInfo.type,
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
  .origin(origin)
  .bind("EnterFrame", function() {
    if(this.move.right) this.rotation += 5;
    if(this.move.left) this.rotation -= 5;

    //acceleration and movement vector
    var vx = Math.sin(this._rotation * Math.PI / 180) * 0.3,
    vy = Math.cos(this._rotation * Math.PI / 180) * 0.3;

    //if the move up is true, increment the y/xspeeds
    if(this.move.up) {
      this.animate('active', 6, -1);
      this.yspeed -= vy;
      this.xspeed += vx;
    } else {
      this.animate('passive', 6, -1);
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
        if (players[p].score >= 10) {
          score.text('player ' + players[p].id + ' wins with ' + players[p].score + ' points!');
          for (var i in players) {
            players[i].destroy();
          }
          return;
        }
        newScore += 'player ' + players[p].id + ': ' + players[p].score + '<br/>';
      }
      score.text(newScore);
    }
  });

  console.log(player._w);
  console.log(player._h);

  switch(playerInfo.type) {
    case "teeth":
      player.animate('active', 0, 0, 1)
            .animate('passive', 0, 0, 1);

      break;
    case "boob":
      player.animate('active', 0, 0, 3)
            .animate('passive', 4, 0, 4);

      break;
    case "eye":
      player.animate('active', 0, 0, 3)
            .animate('passive', 0, 0, 1);

      break;
  }

  player.animate('passive', 6, -1);


  if (playerInfo.id == window.ouro.myId) {
    player.bind("KeyDown", function(e) {
      var data = {};
      data.keyCode = e.keyCode;

      data.x = player._x;
      data.y = player._y;
      data.rotation = player._rotation;

      socket.emit('KeyDown', window.ouro.myId, data);

    }).bind("KeyUp", function(e) {
      var data = {};
      data.keyCode = e.keyCode;

      data.x = player._x;
      data.y = player._y;
      data.rotation = player._rotation;

      socket.emit('KeyUp', window.ouro.myId, data);
    });
  }

  player.collision();

  players.push(player);
}

Crafty.scene("main", function() {
  var socket = window.ouro.socket;

  _.each(window.ouro.playerList, createPlayer);

  socket.on('KeyDown', function(id, data) {
    var player = _.find(players, function(plr) {
      return plr.id == id;
    });

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
      fireBullet(player);
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

  Crafty.background("url('images/bg.png')");

  //score display
  score = Crafty.e("2D, DOM, Text")
  .text("Score: 0")
  .attr({x: Crafty.viewport.width - 300, y: Crafty.viewport.height - 50, w: 200, h:50})
  .css({color: "#fff"});

  //player entity

});



