frameRate(12);


let boxSize = 20;
let cols = width / boxSize;
let rows = height / boxSize;
let gridSize = new physics.Vector(cols, rows);
let gridMiddle = new physics.Vector(cols / 2, rows / 2);

let snake = [gridMiddle.clone()];
let food = new physics.Vector().randomize(physics.origin(), gridSize).floor();
let haveTurned = false;
let gameOver = false;

const NORTH = "N";
const SOUTH = "S";
const WEST = "W";
const EAST = "E";
let facing = EAST;

let cheats = {};
cheats.invul = false;

function restart() {
	snake = [gridMiddle.clone()];
	eatFood();
	haveTurned = false;
	gameOver = false;
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
	fill(colors.ORANGE);
	noStroke()
	rect(food.x * boxSize, food.y * boxSize, boxSize);
}

function renderSnake() {
	fill(colors.LIME);
	noStroke();
	for(let section of snake) {
		rect(section.x * boxSize, section.y * boxSize, boxSize);
	}
	// FUTURE TODO:
	// rect(snake[0].x * boxSize, snake[0].y * boxSize, boxSize);
	// for(let i = 1; i < snake.length; i++) {
	// 	line(snake[i].x * boxSize + boxSize / 2, snake[i].y * boxSize + boxSize / 2, snake[i - 1].x * boxSize + boxSize / 2, snake[i - 1].y * boxSize + boxSize / 2);
	// }
}

function keyDown(e, key) {
	if(haveTurned) return;
	haveTurned = true;
	if(key === "w" && facing !== SOUTH) facing = NORTH;
	else if(key === "s" && facing !== NORTH) facing = SOUTH;
	else if(key === "a" && facing !== EAST) facing = WEST;
	else if(key === "d" && facing !== WEST) facing = EAST;
}

function click(e, button) {
	if(gameOver) restart();
}

function tick() {
	if(!gameOver) {

		snake.unshift(getNextPos());
		if(snake[0].equals(food)) eatFood();
		else snake.pop();

		if(!cheats.invul && colliding()) gameOver = true;

		haveTurned = false;
	}
}

function render() {
	background();

	for(let x = 0; x < cols; x++) {
		for(let y = 0; y < rows; y++) {
			fill(255);
			noStroke();
			rect(x * boxSize, y * boxSize, boxSize);
		}
	}

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

	fill(0);
	noStroke();
	font("Arial", 32);
	textAlign("alphabetic", "start");
	text(`Score: ${snake.length}`, 10, height - 10);
}
