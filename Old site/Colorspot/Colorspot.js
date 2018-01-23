/*\
 *
 *	Colorspot
 *	V 1.0.0
 *	Javascript page 1 of 1
 *	Coded by Isaac Chen
 *	11/1/17 - 11/1/17
 *
\*/

var page = "Colorspot"; // Used by seeecret stuff
var discoEnabled = false;
var discoInterval;

var bgColor = "#FFFFFF";
var graphColor = "#000000";
var graphThickness = 8; // Should be an even number

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var difficultyInput = document.getElementById("gameDifficulty");
var difficultyText = document.getElementById("difficultyText");
var pointsText = document.getElementById("pointsText");
var livesText = document.getElementById("livesText");
var width = canvas.width;
var height = canvas.height;
var boxLength = width >= height ? width / 6 : height / 6;
var boxInnerLength = boxLength - graphThickness;
var boxInset = graphThickness / 2;
var difficulty = "Easy";
var difficultyInfo;
var diffSquare = [0, 0];
var colors = [];
var gameOver = false;
var points = 0;
var lives = 3;
var justClicked = false;

function drawGraph() {
  ctx.strokeStyle = graphColor;
  ctx.lineWidth = graphThickness;

  ctx.beginPath();
  // Vertical lines
  for(var i = 0; i <= 6; i++) {
    ctx.moveTo(boxLength * i, 0);
    ctx.lineTo(boxLength * i, height);
  }
  // Horizontal lines
  for(var i = 0; i <= 6; i++) {
    ctx.moveTo(0, boxLength * i);
    ctx.lineTo(width, boxLength * i);
  }
  ctx.stroke();
  ctx.closePath();
}
function clearCanvas() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
}
function updateDifficulty() {
  switch(difficultyInput.value) {
    case "1":
      difficulty = "Piece of cake";
      difficultyInfo = [32, 64, 8, 16];
      break;
    case "2":
      difficulty = "Easy";
      difficultyInfo = [16, 32, 4, 8];
      break;
    case "3":
      difficulty = "Normal";
      difficultyInfo = [8, 16, 2, 4];
      break;
    case "4":
      difficulty = "Hard";
      difficultyInfo = [4, 8, 1, 2];
      break;
    case "5":
      difficulty = "Expert";
      difficultyInfo = [1, 2, 0, 1];
      break;
  }
  difficultyText.innerHTML = difficulty;
}
function updatePoints() {
  pointsText.innerHTML = points;
}
function updateLives() {
  livesText.innerHTML = lives;
}
function randomInt(min, max) {
  var minInt = Math.ceil(min);
  var maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
}
function coinFlip() {
  return Math.random() <= 0.50;
}
function colorSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * boxLength + boxInset, y * boxLength + boxInset, boxInnerLength, boxInnerLength);
}
function randomizeColors() {
  var hue = randomInt(0, 360);
  var sat = randomInt(20, 100);
  var light = randomInt(20, 80);
  var diffHue = (hue + getHueDiff()) % 360;
  var diffSat = sat + getSatDiff();
  var diffLight = light + getLightDiff();
  colors[0] = "hsl(" + hue + ", " + sat +"%, " + light + "%)";
  colors[1] = "hsl(" + diffHue + ", " + diffSat +"%, " + diffLight + "%)";
}
function getRandomColor() {
  return "#" +
    ("0" + (Math.random()*256|0).toString(16)).substr(-2) +
    ("0" + (Math.random()*256|0).toString(16)).substr(-2) +
    ("0" + (Math.random()*256|0).toString(16)).substr(-2);
}
function getHueDiff() {
  return randomInt(difficultyInfo[0], difficultyInfo[1]) * (coinFlip() ? 1 : -1);
}
function getSatDiff() {
  return randomInt(difficultyInfo[2], difficultyInfo[3]) * (coinFlip() ? 1 : -1);
}
function getLightDiff() {
  return randomInt(difficultyInfo[2], difficultyInfo[3]) * (coinFlip() ? 1 : -1);
}
function disco() {
  for(var i = 0; i < 6; i++) {
    for(var j = 0; j < 6; j++) {
      colorSquare(i, j, getRandomColor());
    }
  }
}
function toggleDisco() {
  if(discoEnabled) {
    clearInterval(discoInterval);
    colorAll("#FFFFFF");
  }
  else {
    drawGraph();
    disco();
    discoInterval = setInterval(disco, 500);
  }
  discoEnabled = !discoEnabled;
}
function colorAll(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  drawGraph();
}
function doLevel() {
  if(gameOver === false) {
    randomizeColors();
    diffSquare = [randomInt(0, 5), randomInt(0, 5)];
    colorAll(colors[0]);
    colorSquare(diffSquare[0], diffSquare[1], colors[1]);
  }
}
function startGame() {
  gameOver = false;
  difficultyInput.style = "visibility: hidden;";
  points = 0;
  lives = 3;
  updateLives();
  doLevel();
}
function clickFunction(x, y) {
  if(!gameOver) {
    if(!justClicked) {
      justClicked = true;
      var clickedBoxX = Math.floor((x - boxInset / 2) / boxLength);
      var clickedBoxY = Math.floor((y - boxInset / 2) / boxLength);
      clickedBoxX = clickedBoxX < 6 ? (clickedBoxX >= 0 ? clickedBoxX : 0) : 5;
      clickedBoxY = clickedBoxY < 6 ? (clickedBoxY >= 0 ? clickedBoxY : 0) : 5;
      if(clickedBoxX === diffSquare[0] && clickedBoxY === diffSquare[1]) {
        colorSquare(clickedBoxX, clickedBoxY, "#00FF00");
        points++;
        updatePoints();
      }
      else {
        colorSquare(clickedBoxX, clickedBoxY, "#FF0000");
        colorSquare(diffSquare[0], diffSquare[1], "#00FF00");
        lives--;
        updateLives();
        setTimeout(function() {
          if(lives < 1) {
            gameOver = true;
            clearCanvas();
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.font = "48px Verdana";
            ctx.fillText("You lost with " + points + " points", 300, 250);
            ctx.fillText("on " + difficulty, 300, 300);
            ctx.font = "32px Verdana";
            ctx.fillText("Click anywhere to play again", 300, 350);
            difficultyInput.style = "visibility: visible;";
          }
        }, 500);
      }
      setTimeout(function() {doLevel();justClicked = false;}, 500);
    }
  }
  else {
    startGame();
  }
}

// Init
canvas.onclick = function(e) {
  clickFunction(e.offsetX, e.offsetY);
}
updateDifficulty();
gameOver = true;
clearCanvas();
ctx.fillStyle = "#000000";
ctx.textAlign = "center";
ctx.font = "48px Verdana";
ctx.fillText("Click anywhere to begin", 300, 300);
difficultyInput.style = "visibility: visible;";