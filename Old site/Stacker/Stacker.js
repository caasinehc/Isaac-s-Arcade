/*\
 *
 *	Stacker
 *	V 1.0.2
 *	Javascript page 1 of 1
 *	Coded by Isaac Chen
 *	12/7/16 - 12/7/16
 *
\*/

// Variables

var page = "Stacker"; // Used by seeecret stuff
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var cWidth = canvas.width;
var cHeight = canvas.height;
var midX = cWidth / 2;
var midY = cHeight / 2;
var left = true;
var right = true;
var targetX = 0;
var posY = 2;
var posX = -1;
var velX = 1;
var color = "#00A0FF";
var borderColor = "#0080CC";
var halloweenColor = "#FF8000";
var halloweenBorderColor = "#804000";
var halloweenMode = false;
var gameOver = false;
var delay = 175;
var points = 0;
var lastTwo = [];
var at7;
var shouldResetGame = false;
var squares = [[-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
 
// Functions

function clearCanvas() {
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, cWidth, cHeight);
  displayPoints();
}
function displayPoints() {
  ctx.fillStyle = "#000000";
  ctx.font = "20px Verdana";
  ctx.fillText("Points: " + points, 10, 590);
}
function hitWall() {
  return (posX - left <= -4 || posX + right >= 4);
}
function resetGame() {
  left = true;
  right = true;
  targetX = 0;
  posY = 2;
  posX = -1;
  velX = 1;
  gameOver = false;
  delay = 175;
  points = 0;
  lastTwo = [];
  squares = [[-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
  gameLoop = function() {
    clearCanvas();
    drawSquares();
    setTimeout(function() {if(!gameOver) {gameLoop()};}, delay);
  }
  gameLoop();
}
function clickFunction() {
  if(shouldResetGame) {
    shouldResetGame = false;
    resetGame();
  }
  else {
    if(posY === 7) {
      at7 = squares.length;
    }
    var missedBy = posX - targetX;
    if(left) {
      if(right) {
        switch(missedBy) {
          case -2:
            left = false;
            right = false;
            targetX = -1;
            squares.push([-1, posY]);
            break;
          case -1:
            left = false;
            targetX = -1;
            squares.push([-1, posY], [0, posY]);
            break;
          case 0:
            squares.push([-1, posY], [0, posY], [1, posY]);
            break;
          case 1:
            right = false;
            targetX = 1;
            squares.push([0, posY], [1, posY]);
            break;
          case 2:
            left = false;
            right = false;
            targetX = 1;
            squares.push([1, posY]);
            break;
          default:
            left = false;
            right = false;
            gameOver = true;
        }
      }
      else {
        switch(missedBy) {
          case -1:
            left = false;
            targetX = 0;
            squares.push([0, posY]);
            break;
          case 0:
            squares.push([0, posY], [1, posY]);
            break;
          case 1:
            left = false;
            squares.push([1, posY]);
            break;
          default:
            left = false;
            gameOver = true;
        }
      }
    }
    else {
      if(right) {
        switch(missedBy) {
          case -1:
            right = false;
            targetX = -1;
            squares.push([-1, posY]);
            break;
          case 0:
            squares.push([-1, posY], [0, posY]);
            break;
          case 1:
            right = false;
            targetX = 0;
            squares.push([0, posY]);
            break;
          default:
            right = false;
            gameOver = true;
        }
      }
      else {
        switch(missedBy) {
          case 0:
            squares.push([targetX, posY]);
            break;
          default:
            gameOver = true;
            break;
        }
      }
    }
    if(!gameOver) {
      posY++;
      points += 5;
      if(delay > 50) {
        delay--;
      }
      if(posY >= 10) {
        posY = 3;
        squares.splice(0, at7);
        for(var i = 0; i < squares.length; i++) {
          squares[i][1] -= 7;
        }
      }
    }
    else {
      shouldResetGame = true;
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.font = "36px Verdana";
      ctx.fillText("You lost with " + points + " points!", cWidth / 2, 200);
      ctx.font = "20px Verdana";
      ctx.fillText("Click anywhere to play again", cWidth / 2, 242);
      ctx.textAlign = "start";
    }
  }
}
function drawSquare(x, y) {
  if(y == undefined) {
    var y = posY;
  }
  var topX = Math.floor(x + 4) * 50;
  if(halloweenMode) {
    ctx.fillStyle = halloweenColor;
    ctx.strokeStyle = halloweenBorderColor;
  }
  else {
    ctx.fillStyle = color;
    ctx.strokeStyle = borderColor;
  }
  ctx.fillRect(topX, 550 - y * 50, 50, 50);
  ctx.lineWidth = 4;
  ctx.strokeRect(topX, 550 - y * 50, 50, 50);
}
function gameLoop() {
  clearCanvas();
  drawSquares();
  setTimeout(function() {if(!gameOver) {gameLoop()};}, delay);
}
function drawSquares() {
  for(var i = 0; i < squares.length; i++) {
    var topX = squares[i][0];
    var topY = squares[i][1];
    drawSquare(topX, topY);
  }
  if(hitWall()) {
    velX *= -1;
  }
  oldPosX = posX;
  posX += velX;
  if(left) {
    drawSquare(posX - 1);
  }
  drawSquare(posX);
  if(right) {
    drawSquare(posX + 1);
  }
}

// Code

canvas.onmousedown = function() { clickFunction(); };
gameLoop();