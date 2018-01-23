/*\
 *
 *	Don't touch red!
 *	V 1.2.1
 *	Javascript page 1 of 1
 *	Coded by Isaac Chen
 *	11/20/16 - 11/20/16
 *
\*/

// Variables

var page = "Don't Touch Red!"; // Used by seeecret stuff
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var orbs = [];
var mouseX = 300;
var mouseY = 300;
var spawnChance = 5;
var gameOver = true;
var points = 0;
var PI2 = Math.PI * 2;
var gameIntervalLoop;
var invulnerable = false;
var unfair = false;
var color = "#00FFFF";
var orbColor = "#FF0000"; // "#FF8000" for Halloween theme :)
var botOn = false;
var gameSpeed = 10;
var rect = {
  x:250,
  y:350,
  width:100,
  heigth:40
};

// Import ice.physics
(function() {
  var modules = ["src/ice.physics.js"];
  for(var module of modules) {
    var script = document.createElement("script");
    script.src = "https://caasinehc.github.io/ice/" + module;
    document.head.appendChild(script);
  }
})();

// Functions

function coinFlip() {
  return Math.random() <= 0.50;
}
function isInside(pos, rect) {
  return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.heigth && pos.y > rect.y
}
function hoverFunction() {
  for(var i = 0; i < 10; i++) {
    setTimeout(function() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, i * 50);
  }
  setTimeout(function() {
    clearCanvas();
    var gameIntervalLoop = setInterval(function() {
      if(!gameOver) {
        gameLoop();
      }
      else {
        clearInterval(gameIntervalLoop);
      }
    }, gameSpeed);
  }, 500);
  canvas.removeEventListener("mousemove", hoverFunction);
  if(botOn) {runBot();}
}
function randomInt(min, max) {
	var minInt = Math.ceil(min);
	var maxInt = Math.floor(max);
	return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
}
function clearCanvas() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function startSequence() {
  orbs = [];
  mouseX = 300;
  mouseY = 300;
  spawnChance = 5;
  gameOver = false;
  points = 0;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.font = "72px Verdana";
  ctx.fillText("Hover to start", 300, 336);
  canvas.style.cursor = "none";
  canvas.addEventListener("mousemove", hoverFunction);
}
function boardWipe() {
  if(points >= 100) {
    orbs = [];
    points -= 100;
    drawPoints();
  }
}
function drawPoints() {
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";
  ctx.font = "24px Verdana";
  ctx.fillText("Points: " + Math.floor(points / 10), 10, 590);
}
function toggleBot() {
  botOn = !botOn;
  if(botOn && !gameOver) {
    ignoreMovement = true;
    runBot();
  }
  else {
    ignoreMovement = false;
  }
}
function runBot() {
  color = "#FFFF00";
  var buffer = 16;
  var clickBuffer = 4;
  
  function tick() {
    if(gameOver || !botOn) {
      clearInterval(botLoop);
    }
    if(moveFunction()) {
      if(getDist(mouseX, mouseY, 300, 300) > 32) {
        goTowards(300, 300);
      }
      else {
        var target = new ice.physics.Vector(300, 300);
        var vel = new ice.physics.Vector(mouseX, mouseY);
        vel.lerp(target, 0.03125);
        mouseX = vel.x;
        mouseY = vel.y;
      }
    }
  }
  function getSign(number) {
    return number < 0 ? -1 : 1;
  }
  function goTowards(x, y) {
    var target = new ice.physics.Vector(x, y);
    var vel = new ice.physics.Vector(mouseX, mouseY);
    vel.towards(target);
    mouseX = vel.x;
    mouseY = vel.y;
  }
  function goAwayFrom(x, y) {
    var target = new ice.physics.Vector(x, y);
    var vel = new ice.physics.Vector(mouseX, mouseY);
    vel.towards(target, -1);
    mouseX = vel.x;
    mouseY = vel.y;
  }
  function getDist(x1, y1, x2, y2) {
    // For performance reasons, I went with this:
    var a = Math.abs(x1 - x2);
    var b = Math.abs(y1 - y2);
    var aSquared = a * a;
    var bSquared = b * b;
    return Math.sqrt(aSquared + bSquared);
    // Instead of this:
    // return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
  }
  function moveFunction() {
    var retVal = true;
    for(var i = 0; i < orbs.length; i++) {
      thisOrb = orbs[i];
      var dist = getDist(mouseX, mouseY, thisOrb.x, thisOrb.y);
      if(dist <= thisOrb.rad + 8 + clickBuffer) {
        retVal = false;
        boardWipe();
      }
      if(dist <= thisOrb.rad + 8 + buffer) {
        retVal = false;
        goAwayFrom(thisOrb.x, thisOrb.y);
      }
    }
    return retVal;
  }
  var botLoop = setInterval(tick, 1);
}
function newOrb() {
	points++;
	orbs.push(new orb());
}
function orb() {
  this.vx = Math.random() * 5 - 2.5;
  this.vy = Math.random() * 5 - 2.5;
  this.rad = randomInt(4, 32);
  this.life = 500;
  if(coinFlip()) {
    this.x = randomInt(0, 600);
    this.y = coinFlip() ? -50 : 650;
  }
  else {
    this.y = randomInt(0, 600);
    this.x = coinFlip() ? -50 : 650;
  }
}
function gameLoop() {
  clearCanvas();
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(mouseX, mouseY, 8, PI2, 0);
	ctx.fill();
	if(randomInt(1, 100) <= spawnChance) {
		newOrb();
	}
	for(var i = 0; i < orbs.length; i++) {
		thisOrb = orbs[i];
		if(thisOrb.x < -50 || thisOrb.x > 650 || thisOrb.y < -50 || thisOrb.y > 650) {
      orbs.splice(i, 1);
      i--;
		}
		else {
			thisOrb.x += thisOrb.vx;
			thisOrb.y += thisOrb.vy;
			ctx.fillStyle = orbColor;
			ctx.beginPath();
			ctx.arc(thisOrb.x, thisOrb.y, thisOrb.rad, PI2, 0);
			ctx.fill();
		}
		if(!invulnerable && (thisOrb.x - mouseX) * (thisOrb.x - mouseX) + (mouseY - thisOrb.y) * (mouseY - thisOrb.y) <= (8 + thisOrb.rad) * (8 + thisOrb.rad) && !gameOver) {
      gameOver = true;
      unfair = false;
      ignoreMovement = false;
      color = "#00FFFF";
      setTimeout(function() {
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.font = "24px Verdana";
        ctx.fillText("You lost with " + Math.floor(points / 10) + " points!", 300, 325);
        ctx.fillStyle = "#808080";
        ctx.fillRect(250, 350, 100, 40);
        ctx.fillStyle = "#000000";
        ctx.font = "16px Verdana";
        ctx.fillText("Replay", 300, 375);
        canvas.style.cursor = "initial";
      }, 100);
		}
  }
  drawPoints();
  if(!unfair && invulnerable) {
    unfair = true;
  }
  if(unfair) {
    ctx.textAlign = "end";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Verdana";
    ctx.fillText("Invulnerable", 590, 590);
    ctx.textAlign = "start";
  }
	if(randomInt(1, 1000) === 1 && spawnChance < 40) {
		spawnChance++;
	}
}

// Code

canvas.onclick = function() {
  if(!gameOver) {boardWipe();}
  else if(isInside({x: mouseX, y: mouseY}, rect)) {startSequence();}
}
canvas.onmousemove = function(e) {
  if(gameOver || !botOn) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  }
}
startSequence();