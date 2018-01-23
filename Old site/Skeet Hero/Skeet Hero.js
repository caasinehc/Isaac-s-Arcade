/*\
 *
 *	Skeet Hero!
 *	V 1.0.0
 *	Javascript page 1 of 1
 *	Coded by Isaac Chen
 *	11/29/16 - 11/29/16
 *
\*/

  /* Variables */

var page = "Skeet Hero"; // Used by seeecret stuff
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var score = 0;
var mouseX = 0;
var mouseY = 0;
var crosshairColor = "#000000";
var skeets = [];
var skeetIndex = 0;
var justShot = false;
var canShoot = true;
var playCount = 2;
var scoreDisplay = document.getElementById("scoreDisplay");
var backgroundImage = document.getElementById("backgroundImage");
var pumpkinImage = document.getElementById("pumpkinImage");
var halloweenMode = false;
var sounds = {
  gunshot2: new Audio("Assets/Audio/Skeet Hero Gunshot 2.mp3"),
  gunshot3: new Audio("Assets/Audio/Skeet Hero Gunshot 3.mp3"),
  gunshot4: new Audio("Assets/Audio/Skeet Hero Gunshot 4.mp3"),
  gunshot5: new Audio("Assets/Audio/Skeet Hero Gunshot 5.mp3"),
  reload: new Audio("Assets/Audio/Skeet Hero Reload.mp3")
}

  /* Functions */

function updateScore() {
  scoreDisplay.innerHTML = "Score: " + score;
}
function randomInt(min, max) {
  var minInt = Math.ceil(min);
  var maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
}
function clearCanvas() {
  ctx.drawImage(backgroundImage, 0, 0);
}
function skeet() {
  if(randomInt(1, 2) === 1) {
    this.x = 0;
  }
  else {
    this.x = 700;
  }
  this.y = randomInt(250, 500);
  if(this.x === 0) {
    this.vx = 2;
  }
  else {
    this.vx = -2;
  }
  this.vy = -2;
  skeetIndex++;
  skeets[skeetIndex] = this;
  this.id = skeetIndex;
}

  /* Code */

clearCanvas();
canvas.onmousemove = function(event) {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
}
canvas.onmousedown = function(event) {
  if(canShoot) {
    justShot = true;
    canShoot = false;
    crosshairColor = "#FF0000";
    switch(playCount) {
      case 2:
        sounds.gunshot2.play();
        playCount = 3;
        break;
      case 3:
        sounds.gunshot3.play();
        playCount = 4;
        break;
      case 4:
        sounds.gunshot4.play();
        playCount = 5;
        break;
      case 5:
        sounds.gunshot5.play();
        playCount = 2;
        break;
    }
    setTimeout(function() {justShot = false;}, 10);
    setTimeout(function() {sounds.reload.play();}, 750);
    setTimeout(function() {crosshairColor = "#000000";}, 750);
    setTimeout(function() {canShoot = true;}, 1000);
  }
}
canvas.style.cursor = "none";
skeet.prototype.draw = function() {
  if(skeetIndex >= 1000000) {
    skeetIndex = 0;
  }
  this.x += this.vx;
  this.y += this.vy;
  this.vy += 0.0125;
  if(halloweenMode) {
    ctx.drawImage(pumpkinImage, this.x - 15, this.y - 15);
  }
  else {
    ctx.fillStyle = "#FF4000";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, Math.PI * 2, 0);
    ctx.fill();
  }
  if(this.x > 700 || this.x < 0 || this.y > 500) {
    delete skeets[this.id];
  }
  if(justShot && this.y - 15 <= mouseY && mouseY <= this.y + 15 && this.x - 15 <= mouseX && mouseX <= this.x + 15) {
    justShot = false;
    score++;
    updateScore();
    delete skeets[this.id];
  }
}
setInterval(function() {
  clearCanvas();
  if(randomInt(1, 250) <= 1) {
    new skeet();
  }
  for(var key in skeets) {
    skeets[key].draw();
  }
  ctx.fillStyle = crosshairColor;
  ctx.fillRect(mouseX - 11, mouseY - 1, 22, 2);
  ctx.fillRect(mouseX - 1, mouseY - 11, 2, 22);
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 11, Math.PI * 2, 0);
  ctx.lineWidth = 2;
  ctx.strokeStyle = crosshairColor;
  ctx.stroke();
}, 10);