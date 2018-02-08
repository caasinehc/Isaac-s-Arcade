let boxSize = 15;
let cols = width / boxSize;
let rows = height / boxSize;
let gridSize = new physics.Vector(cols, rows);
let gridMiddle = new physics.Vector(cols / 2, rows / 2);

let snake = [physics.Vector(0, gridMiddle.y)];
let food = new physics.Vector().randomize(physics.origin(), gridSize).floor();
let haveTurned = false;
let gameOver = true;
let havePlayed = false;

const NORTH = "N";
const SOUTH = "S";
const WEST = "W";
const EAST = "E";
let facing = EAST;

let fair = true;
let cheats = {};
cheats.invul = false;
cheats.superGrow = false;

const difficulties = [
	{
		name: "Slug",
		frameRate: 5
	},
	{
		name: "Snail",
		frameRate: 10
	},
	{
		name: "Snake",
		frameRate: 15
	},
	{
		name: "Cobra",
		frameRate: 20
	},
	{
		name: "Dragon",
		frameRate: 25
	}
];
let difficulty = difficulties[floor((difficulties.length - 1) / 2)];
let playedDifficulty = difficulty.name;

let slider = dom.createSlider(0, difficulties.length - 1, 1, floor((difficulties.length - 1) / 2));
dom.append(dom.createBr());
dom.append(slider);
slider.onchange = (e) => {
	difficulty = difficulties[slider.value];
}
slider.style = `width: ${width}px;`;

let colorList = colors.hues;

let bodyColorIndex = 1;
let bodyColor = colorList[bodyColorIndex];
let bodyColorButton = dom.createButton("Snake Color", function() {
	bodyColorIndex = (bodyColorIndex + 1) % colorList.length;
	bodyColor = colorList[bodyColorIndex];
	this.style.backgroundColor = bodyColor;
});
dom.append(dom.createBr());
dom.append(bodyColorButton);
bodyColorButton.style = (
	`width: ${width / 3}px;
background-color: ${bodyColor}`
);

let foodColorIndex = 4;
let foodColor = colorList[foodColorIndex];
let foodColorButton = dom.createButton("Food Color", function() {
	foodColorIndex = (foodColorIndex + 1) % colorList.length;
	foodColor = colorList[foodColorIndex];
	this.style.backgroundColor = foodColor;
});
dom.append(foodColorButton);
foodColorButton.style = (
	`width: ${width / 3}px;
background-color: ${foodColor};`
)

let styleList = [
	{
		name: "block",
		css: {
			borderStyle: "solid",
			borderRadius: "0px"
		}
	},
	{
		name: "circle",
		css: {
			borderStyle: "solid",
			borderRadius: "32px"
		}
	},
	{
		name: "line",
		css: {
			borderStyle: "dashed",
			borderRadius: "0px"
		}
	}
];

let styleIndex = 0;
let style = styleList[styleIndex];
let styleButton = dom.createButton("Style", function() {
	styleIndex = (styleIndex + 1) % styleList.length;
	style = styleList[styleIndex];
	this.style.borderStyle = style.css.borderStyle;
	this.style.borderRadius = style.css.borderRadius;
});
dom.append(styleButton);
styleButton.style = (
	`width: ${width / 3}px;
background-color: #202020;
color: #FFFFFF;
border: 1px solid #FFFFFF;`
);

function restart() {
	noLoop();
	slider.disabled = true;
	playedDifficulty = difficulty.name;
	snake = [physics.Vector(0, gridMiddle.y)];
	facing = EAST;
	eatFood();
	havePlayed = true;
	haveTurned = true;
	gameOver = false;
	fair = true;
	background();
	fill(0);
	noStroke();
	font("Arial", 48);
	textAlign("middle", "center");
	text("Starting in 3...", midWidth, midHeight);
	setTimeout(() => {
		background();
		text("Starting in 2...", midWidth, midHeight);
	}, 1000);
	setTimeout(() => {
		background();
		text("Starting in 1...", midWidth, midHeight);
	}, 2000);
	setTimeout(() => {
		frameRate(difficulty.frameRate);
		loop();
	}, 3000);
}

function endGame() {
	slider.disabled = false;
	frameRate(60);
	gameOver = true;
}

function getNextPos() {
	let currentPos = snake[0].clone();
	if(facing === NORTH) currentPos.addY(-1);
	if(facing === SOUTH) currentPos.addY(1);
	if(facing === WEST) currentPos.addX(-1);
	if(facing === EAST) currentPos.addX(1);
	if(cheats.invul) currentPos.clamp(physics.origin(), gridSize.clone().subtract(1));
	return currentPos;
}

function colliding() {
	let currentPos = snake[0];
	return(
		currentPos.x < 0 || currentPos.x > cols - 1 ||
		currentPos.y < 0 || currentPos.y > rows - 1 ||
		touchingSelf()
	);
}

function eatFood() {
	food.randomize(physics.origin(), gridSize).floor();
}

// I'm too immature for this *giggles*
function touchingSelf() {
	// This could be way more efficient with Array.some, or just a hashmap,
	// but that's for another day... or another life...
	for(let i = 0; i < snake.length; i++) {
		for(let j = i + 1; j < snake.length; j++) {
			if(snake[i].equals(snake[j])) return true;
		}
	}
	return false;
}

function renderFood() {
	fill(foodColor);
	noStroke()
	if(style.name === "block") {
		rect(food.x * boxSize, food.y * boxSize, boxSize);
	}
	else if(style.name === "circle" || style.name === "line") {
		point(food.clone().add(0.5).mult(boxSize), floor(boxSize / 2));
	}
}

function renderSnake() {
	fill(bodyColor);
	noStroke();
	if(style.name === "block") {
		for(let section of snake) {
			rect(section.x * boxSize, section.y * boxSize, boxSize);
		}
	}
	else if(style.name === "circle") {
		for(let section of snake) {
			point(section.clone().add(0.5).mult(boxSize), floor(boxSize / 2));
		}
	}
	else if(style.name === "line") {
		point(snake[0].clone().add(0.5).mult(boxSize), floor(boxSize / 2));
		stroke(bodyColor);
		for(let i = 1; i < snake.length; i++) {
			line(snake[i].x * boxSize + floor(boxSize / 2), snake[i].y * boxSize + floor(boxSize / 2), snake[i - 1].x * boxSize + floor(boxSize / 2), snake[i - 1].y * boxSize + floor(boxSize / 2));
		}
	}
}

function keyDown(e, key) {
	key = key.toLowerCase();
	if(key === " " && gameOver) restart();
	if(haveTurned) return;
	haveTurned = true;
	if((key === "w" || key === "arrowup") && facing !== SOUTH) facing = NORTH;
	else if((key === "s" || key === "arrowdown") && facing !== NORTH) facing = SOUTH;
	else if((key === "a" || key === "arrowleft") && facing !== EAST) facing = WEST;
	else if((key === "d" || key === "arrowright") && facing !== WEST) facing = EAST;
}

function click(e, button) {
	if(gameOver) restart();
}

function tick() {
	if(!gameOver) {
		snake.unshift(getNextPos());
		if(snake[0].equals(food)) eatFood();
		else if(!(cheats.superGrow && isDown("mouse"))) snake.pop();

		if(!cheats.invul && colliding()) endGame();
		haveTurned = false;

		if(fair) {
			for(let cheat in cheats) {
				if(cheats[cheat]) fair = false;
			}
		}
	}
}

function render() {
	background();

	if(havePlayed) {
		renderFood();
		renderSnake();

		if(gameOver) {
			blur(4);

			fill(0);
			noStroke();
			font("Arial", 64);
			textAlign("alphabetic", "center");
			text("You Died!", midWidth, midHeight - 20);

			font(48);
			textAlign("hanging");
			text("Click anywhere to restart", midWidth, midHeight + 20);
		}
	}
	else {
		fill(0);
		noStroke();
		font("Arial", 48);
		textAlign("middle", "center");
		text("Click anywhere to begin", midWidth, midHeight);
	}

	fill(0);
	noStroke();
	font("Arial", 32);
	textAlign("alphabetic", "start");
	text(`Score: ${snake.length}`, 10, height - 10);

	textAlign("end");
	text(`Difficulty: ${playedDifficulty}${fair ? "" : " (cheats)"}`, width - 10, height - 10);
}
