/*\
 *
 *	Bonsai Simulator
 *	V 2.6.5
 *	Javascript page 1 of 1
 *	Coded by Isaac Chen
 *	10/27/16 - 6/27/17
 *
\*/

/*
 *
 * MAJOR CODE OVERHAUL INCOMING:
 *
 * IDEAS:
 *  + Create a bud constructor instead of this janky budsX and budsY array sh*t
 *  - Remove unneeded variables and functions... I know you're there! Come out, come out, wherever you are! *evil laugh*
 *  ~ Optimize drawing process... loop through the entire seed, THEN draw instead of drawing char 1, then char 1 and 2, etc. WTF was I thinking?
 *  ~ Manage the seed in ONE way, not with an array, a string, a stat object, AND an out-of-sync HTML input box. (Past me <3s making my life difficult)
 *  ~ Ya know, it may be worth just completely rewriting this code from scratch...
 *  + I would REALLY like to finally implement scrolling... maybe that can be done???
 *
 */

	/* Onload */

window.onload = function() {
	// loads images
  var backgroundImage = document.getElementById("backgroundImage");
  var flowerImage = document.getElementById("flowerImage");
  var pumpkinImage = document.getElementById("pumpkinImage");
	// draws background image
	ctx.drawImage(backgroundImage, 0, 0);
};

	/* Variables */

var page = "Bonsai Simulator"; // Used by seeecret stuff
var miracleGrowing = false;
// gets canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// gets Auto-Grow button
var autoGrowButton = document.getElementById("fullGrowButton");
// Declaring global variables...
var halloweenMode = false;
var color = "#408040";
var halloweenColor = "#8000FF"
var seed = ["#"];
var lastNonGraphSeed;
var seedChar;
var budsX = [400];
var budsY = [800];
var posX;
var posY;
var showGraphOn = false;
var showStatsOn = false;
var maxX = 400;
var minX = 400;
var stats = {
  // Seed
	seed: "#",
  // True when no live buds exist
	complete: false,
  // Height
	height: 0,
  // Width
	width: 0,
  // Number of flowers
	buds: 0,
  // Number of splits, +1 (complexity shouldn't be 0, imo)
	complexity: 1,
  // width * height
	size: 0,
  // Number of characters in seed
	volume: 0
};
var growTimer;
var autoGrowing = false;

	/* Functions */

// Auto-grow function
function fullGrow() {
  // if already growing, instantly grow
  if(autoGrowing) {
    clearTimeout(growTimer);
    while(budsX.length > 0) {
      grow();
    }
    autoGrowing = false;
    autoGrowButton.innerHTML = "Auto-Grow";
  }
  else {
    autoGrowing = true;
    autoGrowButton.innerHTML = "Grow Instantly";
    // if complete, reset and grow. If not, grow from current seed
    if(stats.complete) {
      // Resets stuff
      resetCanvas();
      seed = ["#"];
      updateSeedInput();
    }
    // runs grow(); every 100 milliseconds (10 times/second), until there are no more live buds
    growTimer = setInterval(function() {
      // grows 1 step
		  grow();
		  // if there are no live buds left, stop growing
		  if(budsX.length <= 0) {
        // Stops stuff
        clearTimeout(growTimer);
        autoGrowing = false;
        autoGrowButton.innerHTML = "Auto-Grow";
		  }
      // 100 milliseconds (10 times/second)
    }, 100);
  }
}
// checks if two arrays have the same contents, in the same order
function arrEqual(arr1, arr2) {
	// innocent until proven guilty!
	var tempBoo = true;
	// loops through arr1, checking if it does not match arr2
	for(var i = 0; i < arr1.length; i++) {
		// if it does not match...
		if(arr1[i] !== arr2[i]) {
			// proven guilty!
			tempBoo = false;
		}
	}
	// returns whether or not arr1 and arr2 matched
	return tempBoo;
}
// returns the lowest value in an array
function sortArray(array) {
	return array.sort(function(a, b) {return a - b;});
}
// Makes the plant automatically grow when the last one finishes (super seeecret!)
function miracleGrow() {
  if(miracleGrowing === false) {
    fullGrow();
    var miracleGrowLoop = setInterval(function() {
      if(stats.complete) {fullGrow();}
    }, 1000);
  }
  else {
    clearInterval(miracleGrowLoop);
    miracleGrowing = true;
  }
}
// returns the index of the bud with the highest y value, and if there is a tie for the highest y value, the lowest x value among them.
function getCurrentBudIndex() {
	// Lots of temp variables...
	var returnValue;
	var tempArray = [];
	var budsYSorted = budsY.slice(0);
	sortArray(budsYSorted);
	budsYSorted.reverse();
	var maxY = budsYSorted[0];
	// loops through budsY, and notes the index of any that are the highest (or tied for it).
	for(var i = 0; i < budsY.length; i++) {
		if(budsY[i] === maxY) {
			// push the X value into the temporary array
			tempArray.push(budsX[i]);
		}
	}
	// gets the lowest X value among ones with or tied for the highest Y value
	var minX = sortArray(tempArray)[0];
	// loops through budsX and budsY, searching for the bud with the highest Y and lowest X among highest Y
	for(var i = 0; i < budsY.length; i++) {
		if(budsY[i] === maxY && budsX[i] === minX) {
			returnValue = i;
		}
	}
	// returns the index of the bud with the highest Y and lowest X among highest Y
	return returnValue;
}
// show graph (for debugging)
function showGraph() {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 799, 800, 2);
	ctx.fillRect(0, 699, 800, 2);
	ctx.fillRect(0, 599, 800, 2);
	ctx.fillRect(0, 499, 800, 2);
	ctx.fillRect(0, 399, 800, 2);
	ctx.fillRect(0, 299, 800, 2);
	ctx.fillRect(0, 199, 800, 2);
	ctx.fillRect(0, 99, 800, 2);
	ctx.fillStyle = "#808080";
	ctx.fillRect(0, 749, 800, 2);
	ctx.fillRect(0, 649, 800, 2);
	ctx.fillRect(0, 549, 800, 2);
	ctx.fillRect(0, 449, 800, 2);
	ctx.fillRect(0, 349, 800, 2);
	ctx.fillRect(0, 249, 800, 2);
	ctx.fillRect(0, 149, 800, 2);
	ctx.fillRect(0, 49, 800, 2);
	ctx.fillStyle = "#000000";
	ctx.fillRect(799, 0, 2, 800);
	ctx.fillRect(699, 0, 2, 800);
	ctx.fillRect(599, 0, 2, 800);
	ctx.fillRect(499, 0, 2, 800);
	ctx.fillRect(399, 0, 2, 800);
	ctx.fillRect(299, 0, 2, 800);
	ctx.fillRect(199, 0, 2, 800);
	ctx.fillRect(099, 0, 2, 800);
	ctx.fillStyle = "#808080";
	ctx.fillRect(749, 0, 2, 800);
	ctx.fillRect(649, 0, 2, 800);
	ctx.fillRect(549, 0, 2, 800);
	ctx.fillRect(449, 0, 2, 800);
	ctx.fillRect(349, 0, 2, 800);
	ctx.fillRect(249, 0, 2, 800);
	ctx.fillRect(149, 0, 2, 800);
	ctx.fillRect(049, 0, 2, 800);
}
function showStats() {
	ctx.drawImage(backgroundImage, 0, 590, 180, 200, 0, 590, 180, 200);
	ctx.font = "16pt Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Seed: " + stats.seed, 10, 790);
	ctx.fillText("Complete: " + stats.complete, 10, 765);
	ctx.fillText("Height: " + stats.height, 10, 740);
	ctx.fillText("Width: " + stats.width, 10, 715);
	ctx.fillText("Buds: " + stats.buds, 10, 690);
	ctx.fillText("Complexity: " + stats.complexity, 10, 665);
	ctx.fillText("Size: " + stats.size, 10, 640);
	ctx.fillText("Volume: " + stats.volume, 10, 615);
}
// Dion easter egg
function dion() {
	setTimeout(function(){seedInput.value = "#1432114234436624436624436624436624436624436624436623266";useSeed();}, 0);
	setTimeout(function(){seedInput.value = "#1432114234436624436624436624416614436624436624436623266";useSeed();}, 100);
	setTimeout(function(){seedInput.value = "#1432114234436624416614436624416614436624416614436623266";useSeed();}, 200);
	setTimeout(function(){seedInput.value = "#1432114234416614416614416614416614416614416614416613266";useSeed();}, 300);
	setTimeout(function(){seedInput.value = "#1432114234416614416614416614426634416614416614416613266";useSeed();}, 400);
	setTimeout(function(){seedInput.value = "#1432114234416614426634416614426634416614426634416613266";useSeed();}, 500);
	setTimeout(function(){seedInput.value = "#1432114234426634426634426634426634426634426634426633266";useSeed();}, 600);
	setTimeout(function(){seedInput.value = "#1432114234416614426634416614426634416614426634416613266";useSeed();}, 700);
	setTimeout(function(){seedInput.value = "#1432114234416614416614416614426634416614416614416613266";useSeed();}, 800);
	setTimeout(function(){seedInput.value = "#1432114234416614416614416614416614416614416614416613266";useSeed();}, 900);
	setTimeout(function(){seedInput.value = "#1432114234436624416614436624416614436624416614436623266";useSeed();}, 1000);
	setTimeout(function(){seedInput.value = "#1432114234436624436624436624416614436624436624436623266";useSeed();}, 1100);
	setInterval(function(){
		setTimeout(function(){seedInput.value = "#1432114234436624436624436624436624436624436624436623266";useSeed();}, 0);
		setTimeout(function(){seedInput.value = "#1432114234436624436624436624416614436624436624436623266";useSeed();}, 100);
		setTimeout(function(){seedInput.value = "#1432114234436624416614436624416614436624416614436623266";useSeed();}, 200);
		setTimeout(function(){seedInput.value = "#1432114234416614416614416614416614416614416614416613266";useSeed();}, 300);
		setTimeout(function(){seedInput.value = "#1432114234416614416614416614426634416614416614416613266";useSeed();}, 400);
		setTimeout(function(){seedInput.value = "#1432114234416614426634416614426634416614426634416613266";useSeed();}, 500);
		setTimeout(function(){seedInput.value = "#1432114234426634426634426634426634426634426634426633266";useSeed();}, 600);
		setTimeout(function(){seedInput.value = "#1432114234416614426634416614426634416614426634416613266";useSeed();}, 700);
		setTimeout(function(){seedInput.value = "#1432114234416614416614416614426634416614416614416613266";useSeed();}, 800);
		setTimeout(function(){seedInput.value = "#1432114234416614416614416614416614416614416614416613266";useSeed();}, 900);
		setTimeout(function(){seedInput.value = "#1432114234436624416614436624416614436624416614436623266";useSeed();}, 1000);
		setTimeout(function(){seedInput.value = "#1432114234436624436624436624416614436624436624436623266";useSeed();}, 1100);
	}, 1200);
}
// does everything
function drawTree() {
	// Resets stuff
	resetCanvas();
	stats.seed = seed.join("");
  stats.volume = seed.length - 1;
	// loops through each character, drawing and moving buds each time
	// this is where the magic happens...
	for(var i = 1; i < seed.length; i++) {
		seedChar = parseInt(seed[i]);
		currentBudIndex = getCurrentBudIndex();
		posX = budsX[currentBudIndex];
		posY = budsY[currentBudIndex];
		// does something based on what seedChar is
		switch(seedChar) {
			// if 1 (up)
			case 1:
				drawStem(posX, posY, "up");
				budsY[currentBudIndex] -= 25;
				break;
			// if 2 (left)
			case 2:
				drawStem(posX, posY, "left");
				budsX[currentBudIndex] -= 25;
				budsY[currentBudIndex] -= 25;
				break;
			// if 3 (right)
			case 3:
				drawStem(posX, posY, "right");
				budsX[currentBudIndex] += 25;
				budsY[currentBudIndex] -= 25;
				break;
			// if 4 (split)
			case 4:
				drawStem(posX, posY, "split");
				budsY.push(posY - 25);
				budsX.push(posX + 25);
				budsY[currentBudIndex] -= 25;
				budsX[currentBudIndex] -= 25;
				// increment stats.complexity
				stats.complexity++;
				break;
			// if 5 (center)
			case 5:
				drawStem(posX, posY, "center");
				budsY[currentBudIndex] -= 25;
				// if growing bud from right, move bud left
				if(posX > 400) {
					budsX[currentBudIndex] -= 25;
				}
				// if growing bud from left, move bud right
				if(posX < 400) {
					budsX[currentBudIndex] += 25;
				}
				break;
			// if 6 (flower)
			case 6:
				drawStem(posX, posY, "flower");
				// removes dead bud from buds arrays
				budsX.splice(currentBudIndex, 1);
				budsY.splice(currentBudIndex, 1);
				// increments stats.buds
				stats.buds++;
				break;
		}
		// removes duplicate bud values, for when two heads grow to one spot.
		removeDupes();
		if(stats.height < (800 - posY) / 25) {
			stats.height = (800 - posY) / 25;
		}
		if(posX > maxX) {
			maxX = posX;
		}
		if(posX < minX) {
			minX = posX;
		}
		if(stats.width < (maxX - minX) / 25) {
			stats.width = (maxX - minX) / 25;
		}
		if(budsX.length <= 0) {
			stats.complete = true;
		}
		stats.size = stats.width * stats.height;
		// if showStatsOn is true, draw stats
		if(showStatsOn) {
			showStats();
		}
	}
}
// removes duplicate values in budX and budY, for when two heads grow to one spot.
function removeDupes() {
	var tempX = [];
	var tempY = [];
	var tempArray = [];
	// fills tempArray with bud coords
	for(var i = 0; i < budsX.length; i++) {
		tempArray.push([budsX[i], budsY[i]]);
	}
	// loops through tempArray, slicing one of any two equal arrays.
	for(var i = 0; i < tempArray.length; i++) {
		for(var iA = 0; iA < tempArray.length; iA++) {
			// if duplicates are found, splice one.
			if(arrEqual(tempArray[i], tempArray[iA]) && i !== iA) {
				tempArray.splice(iA, 1);
			}
		}
	}
	// translates tempArray back to two arrays, one for X and one for Y
  var i;
	for(i = 0; i < tempArray.length; i++) {
		// pushes X value into return array
		tempX.push(tempArray[i][0]);
		// pushes Y value into return array
		tempY.push(tempArray[i][1]);
	}
  // Restores buds arrays
	budsX = tempX;
	budsY = tempY;
}
function resetCanvas() {
  // Resets stuff... (duh)
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(backgroundImage, 0, 0);
	budsX = [400];
	budsY = [800];
	posX = 400;
	posY = 800;
	maxX = 400;
	minX = 400;
	stats = {
		seed: "#",
		complete: false,
		height: 0,
		width: 0,
		buds: 0,
		complexity: 1,
		size: 0,
		volume: 0
	};
	// if showGraphOn is true, draw graph
	if(showGraphOn) {
		showGraph();
	}
	// if showStatsOn is true, draw stats
	if(showStatsOn) {
		showStats();
	}
}
function updateSeedInput() {
	// sets seed input value to current seed
	document.getElementById("seedInput").value = seed.join("");
}
function drawFlower(x, y) {
  if(halloweenMode) {
    ctx.drawImage(pumpkinImage, x - 24, y - 24);
  }
  else {
    ctx.drawImage(flowerImage, x - 24, y - 24);
  }
}
// Validates seed input value, then sets seed variable.
function useSeed() {
	// for easter eggs
	var doDraw = true;
	// innocent until proven guilty!
	var validChars = true;
  var rawSeedInput = document.getElementById("seedInput").value;
  var inputSeed = rawSeedInput.toLowerCase().split("");
  // loops through seed, checking each character for something other than "1", "2", "3", "4", "5", "6", or "#"
	for(var i = 0; i < inputSeed.length; i++) {
		switch(inputSeed[i]) {
			case "#":
        if(i !== 0) {
          validChars = false;
        }
        break;
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
				break;
			default:
				// Proven guilty!
				validChars = false;
		}
	}
	// if innocent, get seed
  if( inputSeed[0] === "#" && validChars) {
    seed = inputSeed;
    lastNonGraphSeed = seed;
	}
	// if guilty, call em' out!
	else {
    switch(rawSeedInput) {
			case "kate":
			case "mom":
			case "#kate":
			case "#mom":
				resetCanvas();
				drawStem(400, 800, "up");
				drawStem(400, 775, "right");
				drawStem(425, 750, "split");
				drawStem(425, 725, "up");
				drawStem(375, 675, "up");
				drawStem(400, 675, "split");
				drawStem(375, 650, "flower");
				drawStem(325, 650, "center");
				drawStem(325, 600, "right");
				drawStem(350, 575, "right");
				drawStem(375, 550, "flower");
				drawStem(375, 525, "split");
				drawStem(350, 575, "left");
				drawStem(350, 475, "split");
				drawStem(300, 450, "right");
				drawStem(350, 425, "flower");
				ctx.font = "24pt Verdana";
				ctx.fillStyle = "#000000";
				ctx.fillText("Thanks for the debug help, mom!", 10, 34);
				doDraw = false;
				break;
			case "kerri":
			case "#kerri":
				resetCanvas();
				drawStem(400, 800, "up");
				drawStem(400, 775, "right");
				drawStem(425, 750, "split");
				drawStem(400, 725, "up");
				drawStem(400, 700, "up");
				drawStem(400, 675, "split");
				drawStem(375, 650, "left");
				drawStem(350, 625, "split");
				drawStem(325, 600, "right");
				drawStem(350, 575, "right");
				drawStem(375, 550, "up");
				drawStem(375, 525, "split");
				drawStem(350, 500, "left");
				drawStem(325, 475, "split");
				drawStem(300, 450, "right");
				drawStem(325, 425, "flower");
				ctx.font = "24pt Verdana";
				ctx.fillStyle = "#000000";
				ctx.fillText("Thanks for the debug help, Kerri!", 10, 34);
				doDraw = false;
				break;
			case "alex":
			case "#alex":
				resetCanvas();
				drawStem(400, 800, "split");
				drawStem(425, 775, "split");
				drawStem(450, 750, "split");
				drawStem(475, 725, "split");
				drawStem(500, 700, "split");
				drawStem(525, 675, "split");
				drawStem(550, 650, "split");
				drawStem(575, 625, "split");
				drawStem(600, 600, "split");
				drawStem(625, 575, "split");
				drawStem(650, 550, "split");
				drawStem(675, 525, "split");
				drawStem(700, 500, "split");
				drawStem(725, 475, "split");
				drawStem(750, 450, "split");
				drawStem(775, 425, "split");
				drawStem(800, 400, "split");
				drawStem(825, 375, "split");
				drawStem(850, 350, "split");
				drawStem(875, 325, "split");
				drawStem(900, 300, "split");
				ctx.font = "24pt Verdana";
				ctx.fillStyle = "#000000";
				ctx.fillText("Thanks for the debug help, Alex!", 10, 34);
				doDraw = false;
				break;
			case "dion":
			case "#dion":
				dion();
				doDraw = false;
				break;
			case "graph":
			case "#graph":
        if(!showGraphOn) {
				  showGraph();
				  showGraphOn = true;
				  doDraw = false;
        }
        else {
          showGraphOn = false;
          doDraw = false;
          seed = lastNonGraphSeed;
          updateSeedInput();
          resetCanvas();
          useSeed();
          seed = inputSeed;
          updateSeedInput();
        }
				break;
			case "stats":
			case "#stats":
        if(!showStatsOn) {
				  showStats();
				  showStatsOn = true;
				  doDraw = false;
        }
        else {
          ctx.drawImage(backgroundImage, 0, 590, 180, 200, 0, 590, 180, 200);
          showStatsOn = false;
          doDraw = false;
        }
				break;
			default:
				confirm("That's not a valid seed!");
				break;
		}
	}
	if(doDraw) {
		// sets seed, just in case it's out of date.
		updateSeedInput();
		// draws the tree
		drawTree();
	}
}
// generates random interger from "min" to "max" (inclusive)
function randomInt(min, max) {
	return Math.floor( Math.random() * (max - min + 1 )) + min;
}
// adds a new character to seed
function grow() {
	// if there are still buds left, add new character. otherwise, don't change seed.
	if(budsX.length > 0) {
		// if this isn't the first or second character, push 1 to 6
		if(seed.length > 2) {
			// adds character
			seed.push(randomInt(1, 6).toString());
		}
		// if this is the first or second character, push 1 to 5, excluding 6 (so it can't start as a bud, that wouldn't be very exciting.)
		else {
			// adds character
			seed.push(randomInt(1, 5).toString());
		}
		// updates input box
    updateSeedInput();
    // updates lastNonGraphSeed
    lastNonGraphSeed = seed;
		// draws tree
		drawTree();
	}
}
// actual draw function. draws a line from x, y and in mode "mode".
function drawStem(x, y, mode) {
	// sets color
  if(halloweenMode) {
    ctx.fillStyle = halloweenColor;
  }
  else {
    ctx.fillStyle = color;
  }
	// draws something depending on mode from x, y
	switch(mode) {
		// grow up
		case "up":
			ctx.fillRect(x - 4, y - 25, 8, 25);
			break;
		// grow left
		case "left":
			ctx.beginPath();
			ctx.moveTo(x - 4, y);
			ctx.lineTo(x + 4, y);
			ctx.lineTo(x - 21, y - 25);
			ctx.lineTo(x - 29, y - 25);
			ctx.closePath();
			ctx.fill();
			break;
		// grow right
		case "right":
			ctx.beginPath();
			ctx.moveTo(x - 4, y);
			ctx.lineTo(x + 4, y);
			ctx.lineTo(x + 29, y - 25);
			ctx.lineTo(x + 21, y - 25);
			ctx.closePath();
			ctx.fill();
			break;
		// split
		case "split":
			ctx.beginPath();
			ctx.moveTo(x - 4, y);
			ctx.lineTo(x + 4, y);
			ctx.lineTo(x - 21, y - 25);
			ctx.lineTo(x - 29, y - 25);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(x - 4, y);
			ctx.lineTo(x + 4, y);
			ctx.lineTo(x + 29, y - 25);
			ctx.lineTo(x + 21, y - 25);
			ctx.closePath();
			ctx.fill();
			break;
		// grow towards the center
		case "center":
			// if growing from the right, grow left
			if(x > 400) {
				ctx.beginPath();
				ctx.moveTo(x - 4, y);
				ctx.lineTo(x + 4, y);
				ctx.lineTo(x - 21, y - 25);
				ctx.lineTo(x - 29, y - 25);
				ctx.closePath();
				ctx.fill();
			}
			// if growing from the left, grow right
			else if(x < 400) {
				ctx.beginPath();
				ctx.moveTo(x - 4, y);
				ctx.lineTo(x + 4, y);
				ctx.lineTo(x + 29, y - 25);
				ctx.lineTo(x + 21, y - 25);
				ctx.closePath();
				ctx.fill();
			}
			// otherwise, (if in center) grow up
			else {
				ctx.fillRect(x - 4, y - 25, 8, 25);
			}
			break;
		// draw a flower and kill bud
		case "flower":
      drawFlower(x, y);
			break;
	}
}