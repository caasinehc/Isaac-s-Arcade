/*
 *
 *	Snakes!
 *	V 1.3
 *	Javascript page 1 of 1
 *	Coded by Isaac Chen
 *	5/9/16 - 5/18/16
 *
 */

// Variables

var page = "Snakes"; // Used by seeecret stuff
var snakeColor = "#00FF00";
var foodColor = "#FF8000";
var dragonColor = "#D0D0D0";
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var score = 0;
var gameOver = false;
var snakeDirection = "left";
var firstDirectionChange = true;
var snakeX = -100;
var snakeY = -100;
var foodX = -100;
var foodY = -100;
var invulnerable = false;
var unfair = false;
var sections = [];
var reqAnimation = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

// Functions

var randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var updateScore = function() {
  document.getElementById("score").innerHTML = "Score: " + score;
}
var updateDifficulty = function() {
  switch(gameDiff()) {
    case 5:
      document.getElementById("difficultyText").innerHTML = "Slug";
      break;
    case 10:
      document.getElementById("difficultyText").innerHTML = "Snail";
      break;
    case 15:
      document.getElementById("difficultyText").innerHTML = "Snake";
      break;
    case 20:
      document.getElementById("difficultyText").innerHTML = "Cobra";
      break;
    case 25:
      document.getElementById("difficultyText").innerHTML = "Dragon";
      break;
  }
}
var gameDiff = function() {
  return document.getElementById("gameDifficulty").value * 5;
}
var upSnakeColor = function() {
  switch(snakeColor) {
    case "#FF0000":
      snakeColor = "#FF8000";
      document.getElementById("snakeColorButton").style.backgroundColor = "#FF8000";
      break;
    case "#FF8000":
      snakeColor = "#FFFF00";
      document.getElementById("snakeColorButton").style.backgroundColor = "#FFFF00";
      break;
    case "#FFFF00":
      snakeColor = "#00FF00"
      document.getElementById("snakeColorButton").style.backgroundColor = "#00FF00";
      break;
    case "#00FF00":
      snakeColor = "#00FFFF"
      document.getElementById("snakeColorButton").style.backgroundColor = "#00FFFF";
      break;
    case "#00FFFF":
      snakeColor = "#0000FF"
      document.getElementById("snakeColorButton").style.backgroundColor = "#0000FF";
      break;
    case "#0000FF":
      snakeColor = "#8000FF"
      document.getElementById("snakeColorButton").style.backgroundColor = "#8000FF";
      break;
    case "#8000FF":
      snakeColor = "#FF00FF"
      document.getElementById("snakeColorButton").style.backgroundColor = "#FF00FF";
      break;
    case "#FF00FF":
      snakeColor = "#FF0000"
      document.getElementById("snakeColorButton").style.backgroundColor = "#FF0000";
      break;
                   }
}
var upFoodColor = function() {
  switch(foodColor) {
    case "#FF0000":
      foodColor = "#FF8000";
      document.getElementById("foodColorButton").style.backgroundColor = "#FF8000";
      break;
    case "#FF8000":
      foodColor = "#FFFF00";
      document.getElementById("foodColorButton").style.backgroundColor = "#FFFF00";
      break;
    case "#FFFF00":
      foodColor = "#00FF00"
      document.getElementById("foodColorButton").style.backgroundColor = "#00FF00";
      break;
    case "#00FF00":
      foodColor = "#00FFFF"
      document.getElementById("foodColorButton").style.backgroundColor = "#00FFFF";
      break;
    case "#00FFFF":
      foodColor = "#0000FF"
      document.getElementById("foodColorButton").style.backgroundColor = "#0000FF";
      break;
    case "#0000FF":
      foodColor = "#8000FF"
      document.getElementById("foodColorButton").style.backgroundColor = "#8000FF";
      break;
    case "#8000FF":
      foodColor = "#FF00FF"
      document.getElementById("foodColorButton").style.backgroundColor = "#FF00FF";
      break;
    case "#FF00FF":
      foodColor = "#FF0000"
      document.getElementById("foodColorButton").style.backgroundColor = "#FF0000";
      break;
                  }
}
document.onkeydown = function(e) {
  if(firstDirectionChange == true) {
    firstDirectionChange = false;
    switch(e.keyCode) {
      case 37:
        if(snakeDirection != "right") {
          snakeDirection = "left";
        }
        break;
      case 65:
        if(snakeDirection != "right") {
          snakeDirection = "left";
        }
        break;
      case 38:
        if(snakeDirection != "down") {
          snakeDirection = "up";
        }
        break;
      case 87:
        if(snakeDirection != "down") {
          snakeDirection = "up";
        }
        break;
      case 39:
        if(snakeDirection != "left") {
          snakeDirection = "right";
        }
        break;
      case 68:
        if(snakeDirection != "left") {
          snakeDirection = "right";
        }
        break;
      case 40:
        if(snakeDirection != "up") {
          snakeDirection = "down";
        }
        break;
      case 83:
        if(snakeDirection != "up") {
          snakeDirection = "down";
        }
        break;
                    }
  }
}
var drawBox = function(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 4, y - 4);
  ctx.lineTo(x + 4, y - 4);
  ctx.lineTo(x + 4, y + 4);
  ctx.lineTo(x - 4, y + 4);
  ctx.closePath();
  ctx.fill();
}
var resetCanvas = function() {
  ctx.clearRect(0, 0, 320, 320);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 320, 320);
}
var snakeInit = function() {
  sections = [];
  snakeX = 164;
  snakeY = 164;
  for(i = snakeX + 40; i >= snakeX; i -= 8) {
    sections.push(i + "," + snakeY);
  }
}
var moveSnake = function() {
  switch(snakeDirection) {
    case "left":
      snakeX -= 8;
      break;
    case "up":
      snakeY -= 8;
      break;
    case "right":
      snakeX += 8;
      break;
    case "down":
      snakeY += 8;
      break;
                       }
  checkCollision();
  checkGrowth();
  sections.push(snakeX + "," + snakeY);
  firstDirectionChange = true;
}
var drawSection = function(section) {
  if(gameDiff() >= 25) {
    drawBox(parseInt(section[0]), parseInt(section[1]), dragonColor);
  }
  else {
    drawBox(parseInt(section[0]), parseInt(section[1]), snakeColor);
  }
}
var drawSnake = function() {
  for(i = 0; i < sections.length; i++) {
    drawSection(sections[i].split(","));
  }
}
var checkCollision = function() {
  if(!invulnerable && isCollision(snakeX, snakeY) === true) {
    gameOver = true;
    document.getElementById("startGameButton").style.visibility = "visible";
    document.getElementById("gameDifficulty").style.visibility = "visible";
    document.getElementById("snakeColorButton").style.width = "96px";
    document.getElementById("foodColorButton").style.width = "96px";
  }
}
var isCollision = function(x, y) {
  if(x < 4 || x > 320 || y < 4 || y > 320 || sections.indexOf(x + "," + y) >= 0) {
    return true;
  }
}
var checkGrowth = function() {
  if(snakeX == foodX && snakeY == foodY) {
    score++;
    updateScore();
    setFood();
  }
  else {
    sections.shift();
  }
}
var setFood = function() {
  foodX = (randomInt(1, 10) * 32) - 4;
  foodY = (randomInt(1, 10) * 24) - 4;
}
var drawFood = function() {
  if(gameDiff() >= 25) {
    drawBox(foodX, foodY, dragonColor);
  }
  else {
    drawBox(foodX, foodY, foodColor);
  }
}
var startGame = function() {
  if(gameOver) {
    document.body.style.overflow = "hidden";
    if(gameDiff() >= 25) {
      document.getElementById("snakeColorButton").style.visibility = "hidden";
      document.getElementById("foodColorButton").style.visibility = "hidden";
      setTimeout(function() {dragonColor = "#000000";}, 250);
      setTimeout(function() {dragonColor = "#202020";}, 500);
      setTimeout(function() {dragonColor = "#404040";}, 750);
      setTimeout(function() {dragonColor = "#606060";}, 1000);
      setTimeout(function() {dragonColor = "#808080";}, 1250);
      setTimeout(function() {dragonColor = "#A0A0A0";}, 1500);
      setTimeout(function() {dragonColor = "#C0C0C0";}, 1750);
      setTimeout(function() {dragonColor = "#D0D0D0";}, 2000);
    }
    else {
      document.getElementById("snakeColorButton").style.visibility = "visible";
      document.getElementById("foodColorButton").style.visibility = "visible";
    }
    document.getElementById("startGameButton").style.visibility = "hidden";
    document.getElementById("gameDifficulty").style.visibility = "hidden";
    document.getElementById("snakeColorButton").style.width = "150px";
    document.getElementById("foodColorButton").style.width = "150px";
    score = 0;
    gameOver = false;
    snakeDirection = "left";
    snakeInit();
    setFood();
    updateScore();
  }
}
var gameLoop = function() {
  if(gameOver === false) {
    if(gameDiff() >= 25) {
      if(randomInt(1, 100) == 1 && dragonColor == "#D0D0D0") {
        dragonColor = "#FFFFFF";
        dragonColor = "#FFFFFF";
        setTimeout(function() {
          dragonColor = "#D0D0D0";
        }, 1000);
      }
    }
    resetCanvas();
    moveSnake();
    drawFood();
    drawSnake();
  }
  if(gameOver === true) {
    document.body.style.overflow = "initial";
    unfair = false;
    resetCanvas();
    ctx.font = "48px Verdana";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", 160, 140);
    ctx.font = "32px Verdana";
    ctx.fillText("Score: " + score, 160, 200);
  }
  if(!unfair && invulnerable) {
    unfair = true;
  }
  if(unfair) {
    ctx.textAlign = "end";
    ctx.fillStyle = "#000000";
    ctx.font = "16px Verdana";
    ctx.fillText("Invulnerable", 310, 310);
    ctx.textAlign = "start";
  }
  setTimeout(function() {
    requestAnimationFrame(gameLoop);
  }, 1000 / gameDiff());
}
gameLoop();