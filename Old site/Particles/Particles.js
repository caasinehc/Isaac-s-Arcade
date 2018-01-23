/*\
 *
 *	Particles
 *	V 2.2.6
 *	Javascript page 1 of 1
 *	Coded by Isaac Chen
 *	10/27/16 - 9/27/17
 *
\*/

// false, 0, 1, 100, 100, -10, 0, -10, 0, -0.1, 0.1, -0.1, 0.1, 20, #1aa2b9, square, 4, source-over, 0

// Variables

var page = "Particles"; // Used by seeecret stuff
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var settingsButton = document.getElementById("settingsButton");
var settingsDiv = document.getElementById("settingsDiv");
var optimizeButton = document.getElementById("optimizeButton");
var particles = [];
var dyingParticles = [];
var presets;
var settingsShown = false;
var optimizeForGraphics = true;
var srcX = canvasWidth / 2;
var srcY = canvasHeight / 2;
var mouseDown = false;
var PI2 = Math.PI * 2;
var FPS;
var framesLastSec;

// Settings

function getGravity() { return document.getElementById("gravity").checked;}
function getWeight() { return	parseFloat(getVal("weight"));}
function getCount() { return parseFloat(parseFloat(getVal("count")).toFixed(2));}
function getMinLife() { return parseInt(getVal("minLife"));}
function getMaxLife() { return parseInt(getVal("maxLife"));}
function getMinInitVX() { return parseFloat(getVal("minInitVX"));}
function getMaxInitVX() { return parseFloat(getVal("maxInitVX"));}
function getMinInitVY() { return parseFloat(getVal("minInitVY"));}
function getMaxInitVY() { return parseFloat(getVal("maxInitVY"));}
function getMinVX() { return parseFloat(getVal("minVX"));}
function getMaxVX() { return parseFloat(getVal("maxVX"));}
function getMinVY() { return parseFloat(getVal("minVY"));}
function getMaxVY() { return parseFloat(getVal("maxVY"));}
function getTurnChance() { return parseInt(getVal("turnChance"));}
function getColor() { return getVal("color");}
function getShape() { return	checkedRadio("shape");}
function getSize() { return parseInt(getVal("size"));}
function getOverlap() { return document.getElementById("overlap").checked ? "lighter" : "source-over";}
function getTrail() { return parseFloat(getVal("trail"));}
function getShowFPS() { return document.getElementById("FPS").checked;}
function getPresetInput() { return document.getElementById("presetInput").value;}

// Settings interpreters/helpers

function getVal(setting) { return document.getElementById(setting).value;}
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min;}
function randomNum(min, max) { return Math.random() * (max - min) + min;}
function getLife() { return randomInt(getMinLife(), getMaxLife());}
function getInitVX() { return randomNum(getMinInitVX(), getMaxInitVX());}
function getInitVY() { return randomNum(getMinInitVY(), getMaxInitVY());}
function getCanvasColor() { return "rgba(0, 0, 0, " + ((100 - getTrail()) / 100) + ")";}
function shouldTurn(chance) { return randomInt(1, 100) <= chance;}
function randomRainbowColor() { return "hsla(" + parseInt(Math.random() * 360, 10) + ", 100%, 50%, 1)";}
function randomColor() {
  return "#" +
    ("0" + (Math.random()*256|0).toString(16)).substr(-2) +
    ("0" + (Math.random()*256|0).toString(16)).substr(-2) +
    ("0" + (Math.random()*256|0).toString(16)).substr(-2);
}
function interpretColor() {
  switch(getColor()) {
    case "random":
      return randomColor();
    case "rainbow":
      return randomRainbowColor();
    default:
      return getColor();
  }
}
function checkedRadio(name) {
  var options = document.getElementsByName(name);
  for(var key in options) {
    if(options[key].checked) { return options[key].value;}
  }
}
function toggleOptimize() {
  if(optimizeForGraphics) {
    optimizeButton.innerHTML = "Performance";
  }
  else {
    optimizeButton.innerHTML = "Graphics";
  }
  optimizeForGraphics = !optimizeForGraphics;
}
function setPresetInput(preset) {
  document.getElementById("presetInput").value = preset;
}
function updatePresetInput() {
  var preset = [
    getGravity(),
    getWeight(),
    getCount(),
    getMinLife(),
    getMaxLife(),
    getMinInitVX(),
    getMaxInitVX(),
    getMinInitVY(),
    getMaxInitVY(),
    getMinVX(),
    getMaxVX(),
    getMinVY(),
    getMaxVY(),
    getTurnChance(),
    getColor(),
    getShape(),
    getSize(),
    getOverlap(),
    getTrail()
  ];
  setPresetInput(preset.join(", "));
}
function usePresetInput() {
  var rawPresetArray = getPresetInput().split(", ");
  var presetToUse = new preset(
    (rawPresetArray[0] === "true"),
    parseFloat(rawPresetArray[1]),
    parseInt(rawPresetArray[2]),
    parseInt(rawPresetArray[3]),
    parseInt(rawPresetArray[4]),
    parseFloat(rawPresetArray[5]),
    parseFloat(rawPresetArray[6]),
    parseFloat(rawPresetArray[7]),
    parseFloat(rawPresetArray[8]),
    parseFloat(rawPresetArray[9]),
    parseFloat(rawPresetArray[10]),
    parseFloat(rawPresetArray[11]),
    parseFloat(rawPresetArray[12]),
    parseFloat(rawPresetArray[13]),
    rawPresetArray[14],
    rawPresetArray[15],
    parseInt(rawPresetArray[16]),
    rawPresetArray[17],
    parseFloat(rawPresetArray[18])
  );
  usePreset(presetToUse);
}
function randomizeSettings() {
  var randomMinLife = randomInt(0, 100);
  var randomInitV = parseFloat(randomNum(0, 5).toFixed(2));
  var randomV = parseFloat(randomNum(0, 5).toFixed(2));
  var randomPreset = new preset(
    Math.random() >= 0.5, // gravity
    Math.random().toFixed(2), // weight
    randomInt(1, 8), // count
    randomMinLife, // minLife
    randomMinLife + randomInt(0, 100), // maxLife
    randomInitV * -1, // minInitVX
    randomInitV, // maxInitVX
    randomInitV * -1, // minInitVY
    randomInitV, // maxInitVY
    randomV * -1, // minVX
    randomV, // maxVX
    randomV * -1, // minVY
    randomV, // maxVY
    randomInt(0, 100), // turnChance
    randomColor(), // color
    Math.random() >= 0.5 ? "circle" : "square", // shape
    randomInt(1, 8), // size
    Math.random() >= 0.5, // overlap
    randomInt(0, 95) // trail
  );
  usePreset(randomPreset);
}

// Preset constructor function
function preset(gravity, weight, count, minLife, maxLife, minInitVX, maxInitVX, minInitVY, maxInitVY, minVX, maxVX, minVY, maxVY, turnChance, color, shape, size, overlap, trail) {
  this.gravity = gravity;
  this.weight = weight;
  this.count = count;
  this.minLife = minLife;
  this.maxLife = maxLife;
  this.minInitVX = minInitVX;
  this.maxInitVX = maxInitVX;
  this.minInitVY = minInitVY;
  this.maxInitVY = maxInitVY;
  this.minVX = minVX;
  this.maxVX = maxVX;
  this.minVY = minVY;
  this.maxVY = maxVY;
  this.turnChance = turnChance;
  this.color = color;
  this.shape = shape;
  this.size = size;
  this.overlap = overlap;
  this.trail = trail;
}
presets = {
  fire: new preset(false, 0, 8, 20, 100, -2, 2, -2, 0, -2, 2, -2, 0, 99, "#FF1000", "circle", 3, true, 85),
  bee: new preset(false, 0, 50, 20, 20, -5, 5, -5, 5, -5, 5, -5, 5, 90, "#FFFF00", "square", 1, false, 0),
  water: new preset(true, 0.15, 10, 20, 100, -1, 1, -1, 1, -1, 1, -1, 1, 2, "#0008FF", "circle", 8, true, 85),
  pixie: new preset(false, 0, 50, 10, 20, -2, 2, -2, 2, -2, 2, -2, 2, 80, "pink", "circle", 4, false, 0),
  dirt: new preset(false, 0, 10, 20, 200, -1, 1, 0, 10, -1, 1, 0, 10, 100, "#603020", "square", 2, false, 0),
  steam: new preset(true, -0.1, 4, 20, 400, -1, 1, -1, 1, -1, 1, -1, 1, 5, "#020202", "circle", 12, true, 50),
  bouncy: new preset(true, 0.15, 0.08, 200, 400, -2.5, 2.5, -2.5, 2.5, -2.5, 2.5, -2.5, 2.5, 0, "rainbow", "circle", 24, false, 85),
  ethereal: new preset(true, 0.25, 1, 90, 110, -1, 1, 1, 1, -1, 1, 1, 1, 100, "#0800FF", "circle", 32, true, 90),
  gas: new preset(false, 0, 8, 20, 100, -2, 2, -2, 0, -2, 2, -2, 0, 100, "#10FF00", "circle", 3, true, 90),
  bubbles: new preset(true, -0.025, 0.04, 200, 400, -4, 4, -4, 4, -1, 1, -1, 1, 5, "#204060", "circle", 16, true,  0),
  frozenWater: new preset(true, 0.15, 10, 20, 100, -1, 1, -1, 1, -1, 1, -1, 1, 2, "#0008FF", "circle", 8, true, 100), // Special thanks to Kate Chen for this idea!
  ice: "ice",
  randomPreset: "randomPreset",
  random: "random",
  hidden: 5
};
function usePreset(presetToUse) {
  if(presetToUse === "randomPreset") {
    var keys = Object.keys(presets);
    usePreset(presets[keys[randomInt(0, keys.length - (presets.hidden + 1))]]);
    return;
  }
  else if(presetToUse === "random") {
    randomizeSettings();
    return;
  }
  else if(presetToUse === "ice") {
    usePreset(presets.water);
    setTimeout(function() { usePreset(presets.frozenWater);}, 5000);
    return;
  }
  document.getElementById("gravity").checked = presetToUse.gravity;
  document.getElementById("weight").value = presetToUse.weight;
  document.getElementById("count").value = presetToUse.count;
  document.getElementById("minLife").value = presetToUse.minLife;
  document.getElementById("maxLife").value = presetToUse.maxLife;
  document.getElementById("minInitVX").value = presetToUse.minInitVX;
  document.getElementById("maxInitVX").value = presetToUse.maxInitVX;
  document.getElementById("minInitVY").value = presetToUse.minInitVY;
  document.getElementById("maxInitVY").value = presetToUse.maxInitVY;
  document.getElementById("minVX").value = presetToUse.minVX;
  document.getElementById("maxVX").value = presetToUse.maxVX;
  document.getElementById("minVY").value = presetToUse.minVY;
  document.getElementById("maxVY").value = presetToUse.maxVY;
  document.getElementById("turnChance").value = presetToUse.turnChance;
  document.getElementById("color").value = presetToUse.color;
  document.getElementById("square").checked = (presetToUse.shape === "square");
  document.getElementById("circle").checked = (presetToUse.shape === "circle");
  document.getElementById("size").value = presetToUse.size;
  document.getElementById("overlap").checked = presetToUse.overlap;
  document.getElementById("trail").value = presetToUse.trail;
}

function resetPos() {
  srcX = canvasWidth / 2;
  srcY = canvasHeight / 2;
}
function showSettings() {
  if(settingsShown) {
    settingsShown = false;
    settingsButton.innerHTML = "Show settings";
    settingsDiv.style = "display: none;";
  }
  else {
    settingsShown = true;
    settingsButton.innerHTML = "Hide settings";
    settingsDiv.style = "display: initial;";
  }
}
function drawRectangle(x, y, x2, y2, color) {
  var width;
  var height;
  ctx.fillStyle = color;
  if( x >= x2 ) {
    width = x - x2;
  }
  else {
    width = x2 - x;
  }
  if( y >= y2 ) {
    height = y - y2;
  }
  else {
    height = y2 - y;
  }
  ctx.fillRect(x, y, width, height);
}
function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, PI2, false);
  ctx.fill();
}
function getFPS() {
  return isNaN(FPS) ? 60 : FPS;
}
function Particle() {
  this.X = srcX;
  this.Y = srcY;
  this.VX = getInitVX();
  this.VY = getInitVY();
  this.minVX = getMinVX();
  this.maxVX = getMaxVX();
  this.minVY = getMinVY();
  this.maxVY = getMaxVY();
  this.turnChance = getTurnChance();
  this.age = 0;
  this.life = getLife();
  this.gravity = getGravity();
  this.weight = getWeight();
  this.color = interpretColor();
  this.size = getSize();
  this.radius = this.size / 2;
  this.overlap = getOverlap();
  this.shape = getShape();
  particles[particles.length] = this;
}
function checkKey(e) {
  e = e || window.event;
  switch(e.keyCode) {
    case 87:
    case 38:
      srcY -= 5;
      if(srcY <= 10) { srcY = 10;}
      break;
    case 65:
    case 37:
      srcX -= 5;
      if(srcX <= 10) { srcX = 10;}
      break;
    case 83:
    case 40:
      srcY += 5;
      if(srcY >= 490) { srcY = 490;}
      break;
    case 68:
    case 39:
      srcX += 5;
      if(srcX >= 490) { srcX = 490;}
      break;
  }
}

// Onload
window.onload = function() {
  usePreset("randomPreset");
  setInterval(function(){
    FPS = framesLastSec;
    framesLastSec = 0;
  }, 1000);
  settingsDiv.style = "display: none;";
  canvas.style.cursor = "crosshair";
  canvas.onmousemove = function(e) { if(mouseDown) { srcX = e.offsetX; srcY = e.offsetY; } };
  document.onmousedown = function() { mouseDown = true; };
  document.onmouseup = function() { mouseDown = false; };
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  Particle.prototype.draw = function() {
    this.X += this.VX;
    this.Y += this.VY;
    if(shouldTurn(this.turnChance)) {
      this.VX = randomInt(this.minVX, this.maxVX);
      this.VY = randomInt(this.minVY, this.maxVY);
    }
    if(this.gravity) {
      this.VY += this.weight;
    }
    if(this.Y >= canvasHeight - this.radius && this.VY > 0) {
      this.VY *= -0.8;
    }
    if(this.Y <= this.radius && this.VY < 0) {
      this.VY *= -0.8;
    }
    if(this.X >= canvasWidth - this.radius && this.VX > 0) {
      this.VX *= -0.8;
    }
    if(this.X <= this.radius && this.VX < 0) {
      this.VX *= -0.8;
    }
    ctx.fillStyle = this.color;
    if(optimizeForGraphics) {
      if(ctx.globalCompositOperation !== this.overlap) {
        ctx.globalCompositeOperation = this.overlap;
      }
    }
    if(this.shape === "circle") {
      ctx.beginPath();
      ctx.arc(this.X, this.Y, this.radius, 0, PI2, false);
      ctx.fill();
    }
    else {
      ctx.fillRect(this.X - this.radius, this.Y - this.radius, this.size, this.size);
    }
    this.age++;
    if(this.age >= this.life || isNaN(this.life)) {
      if(optimizeForGraphics) {
        dyingParticles.push(particles.indexOf(this));
      }
      else {
        particles.splice(particles.indexOf(this), 1);
      }
    }
  };
  function gameLoop() {
    var partNum = getCount();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = getCanvasColor();
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    if(partNum >= 1 || partNum <= 0) {
      for(var i = 0; i < partNum; i++) {
        new Particle();
      }
    }
    else {
      if(partNum >= Math.random().toFixed(2)) {
        new Particle();
      }
    }
    document.onkeydown = checkKey;
    if(!optimizeForGraphics) {
      ctx.globalCompositeOperation = getOverlap();
    }
    for(var i = 0; i < particles.length; i++) {
      particles[i].draw();
    }
    if(optimizeForGraphics) {
      for(var i = 0; i < dyingParticles.length; i++) {
        particles.splice(dyingParticles[i], 1);
      }
      dyingParticles = [];
    }
    if(getShowFPS()) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000000";
      ctx.fillRect(450, 480, 50, 20);
      ctx.font = "8pt Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(getFPS() + " FPS", 455, 495);
    }
    framesLastSec++;
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
};