window.ouro = window.ouro || {};

var spritesDir = "images/sprites/";
var boobDir = spritesDir + "boob/";
var eyeDir = spritesDir + "eye/";
var teethDir = spritesDir + "teeth/";



var Crafty = Crafty;
var assetUrls = {
  // BOOB
  boobBombExplosion: boobDir+"bombing.png",
  boob: boobDir+"boob.png",
  boobBomb: boobDir+"boob_bomb.png",
  boobGunSpit: boobDir+"boob_gun_spit.png",

  // EYE
  eyeLaser: eyeDir+"eye_laser.png",
  eyeMissiles: eyeDir+"eye_missiles.png",
  eyeMissileSmoke: eyeDir+"eye_missile_smoke.png",
  eye: eyeDir+"eye.png",

  // TEETH
  teethHandChainDot: teethDir+"teeth_hand_chain_dot.png",
  teethHand: teethDir+"teeth_hand.png",
  teeth: teethDir+"teeth.png"
};

window.ouro.assets = [
  "images/bg.png",
];

window.ouro.setupAssets = function() {
  // Eye
  Crafty.sprite(112, 137, assetUrls.eye,{
    EyeSprite: [0, 0]
  });

  Crafty.sprite(10, 26, assetUrls.eyeLaser,{
    EyeLaserSprite: [0, 0]
  });

  Crafty.sprite(25, 31, assetUrls.eyeMissileSmoke, {
    EyeMissileSmokeSprite: [0, 0]
  });

  Crafty.sprite(45, 49, assetUrls.eyeMissiles, {
    EyeMissilesSprite: [0, 0]
  });

  // Teeth
  Crafty.sprite(93, 229, assetUrls.teeth,{
    TeethSprite: [0, 0]
  });

  Crafty.sprite(57, 100, assetUrls.teethHand,{
    TeethHandSprite: [0, 0]
  });

  Crafty.sprite(33, 33, assetUrls.teethHandChainDot,{
    TeethHandChainDotSprite: [0, 0]
  });

  // Boob
  Crafty.sprite(44, 104, assetUrls.boobGunSpit,{
    BoobGunSpitSprite: [0, 0]
  });

  Crafty.sprite(127, 130, assetUrls.boobBomb,{
    BoobBombSprite: [0, 0]
  });

  Crafty.sprite(317, 295, assetUrls.boobBombExplosion,{
    BoobBombExplosionSprite: [0, 0]
  });

  Crafty.sprite(171, 303, assetUrls.boob, {
    BoobSprite: [0, 0]
  });
};
