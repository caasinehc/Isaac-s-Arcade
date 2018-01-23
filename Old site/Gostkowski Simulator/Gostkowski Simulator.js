/*
 *
 *	Gostkowski Simulator
 *	V 1.2.2
 *	Javascript page 1 of 1
 *	Coded by Isaac Chen
 *	10/31/16 - 10/31/16
 *
 */

var page = "Gostkowski Simulator"; // Used by seeecret stuff
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var backgroundImage = document.getElementById("backgroundImage");
var footballImage = document.getElementById("footballImage");
var pointsDisplay = document.getElementById("pointsDisplay");
var barFill = 0;
var barInc = 1;
var footballX = 0;
var footballY = 0;
var points = 0;
var drawTime = 0;
var drawMode;
var animation1;
var haveStarted = false;
var ready = false;

function resetCanvas() {
	ctx.drawImage(backgroundImage, 0, 0);
	ctx.fillStyle = "#000000";
	ctx.fillRect(288, 378, 104, 14);
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(290, 380, 100, 10);
}
document.onkeydown = checkKey;
function checkKey(e) {
		e = e || window.event;
		switch(e.keyCode) {
			case 32:
				spacePressed();
				break;
	};
}
document.onclick = function() {
  spacePressed();
}
window.onload = function() {
	resetCanvas();
};
function drawShot() {
	ctx.fillStyle = "#000000";
	ctx.font = "30px Arial";
	switch(drawMode) {
		case "perfect":
			ctx.fillText("Perfect Shot!", 110, 100);
			break;
		case "epic":
			ctx.fillText("Great Shot!", 110, 100);
			break;
		case "nice":
			ctx.fillText("Off the post!", 110, 100);
			break;
		case "miss":
			ctx.fillText("You missed!", 110, 100);
			break;
		case "fail":
			ctx.fillText("Where ya aimin' for, mate?!", 10, 100);
			break;
	};
}
function spacePressed() {
  if(ready) {
    ready = false;
    if (barFill >= 99) {
      points += 25;
      drawMode = "perfect";
      drawTime = 100;
      footballX = 0;
		  footballY = 0;
		  footballY -= 10;
		  footballX -= 2;
		  animation1 = setInterval(function() {
        footballY -= 5;
		  }, 10);
    }
    else if (barFill >= 95 && barFill < 99) {
      points += 5;
		  drawMode = "epic";
		  drawTime = 100;
		  footballX = 0;
		  footballY = 0;
		  footballY -= 10;
		  footballX -= 2;
		  animation1 = setInterval(function() {
        footballY -= 5;
		    footballX += 1;
		  }, 10);
    }
    else if (barFill >= 90 && barFill < 95) {
      points -= 5;
		  drawMode = "nice";
		  drawTime = 100;
      footballX = 0;
		  footballY = 0;
		  footballY -= 10;
		  footballX -= 2;
		  animation1 = setInterval(function() {
        footballY -= 5;
			 footballX += 2;
		  }, 10);
    }
    else if (barFill <= 75 && barFill > 50) {
      points -= 25;
		  drawMode = "miss";
      drawTime = 100;
		  footballX = 0;
		  footballY = 0;
		  footballY -= 10;
		  footballX -= 2;
		  animation1 = setInterval(function() {
        footballY -= 5;
			 footballX += 3;
		  }, 10);
    }
    else if (barFill <= 50) {
      points = Math.floor(points * 0.5);
		  drawMode = "fail";
		  drawTime = 100;
		  footballX = 0;
		  footballY = 0;
		  footballY -= 10;
		  footballX -= 2;
		  animation1 = setInterval(function() {
        footballY -= 5;
			 footballX += 4;
      }, 10);
    };
    setTimeout(function() {
      clearInterval(animation1);
      ready = true;
    }, 500);
    pointsDisplay.innerHTML = "Points: " + points;
  }
}
function startGame() {
  if(!haveStarted) {
    document.body.style.overflow = "initial";
		points = 0;
    setTimeout(function() {ready = true;}, 100);
		document.getElementById("startGameButton").style.visibility = "hidden";
		setInterval(function() {
			barFill += barInc;
			if(barFill >= 100 || barFill <= 0) {
				barInc *= -1;
			};
			resetCanvas();
			ctx.drawImage(footballImage, footballX + 160, footballY + 280);
			ctx.fillStyle = "#00FF00";
			ctx.fillRect(290, 380, barFill, 10);
			if(drawTime > 0) {
				drawShot();
				drawTime--;
			};
		}, 10);
		haveStarted = true;
	};
}