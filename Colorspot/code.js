let lives = 3;
let score = 0;
let mouseInScene = false;
let justClicked = false;
let gameOver = false;
let havePlayed = false;
let clickedBox = physics.origin();
let scoreBoxHeight = 50;
let gridSize = new Vector(6, 6);
let gridLineWidth = 6;
let boxSize = new Vector((width - gridLineWidth) / gridSize.x, ((height - gridLineWidth) - scoreBoxHeight) / gridSize.y);
let mainColor;
let differentColor;
let differentBox = new Vector(randomInt(gridSize.x - 1), randomInt(gridSize.y - 1));

function Difficulty(name, hueMin, hueMax, satLgtMin, satLgtMax) {
	this.name = name;
	this.hueMin = hueMin;
	this.hueMax = hueMax;
	this.satLgtMin = satLgtMin;
	this.satLgtMax = satLgtMax;
}

let difficulties = [
	new Difficulty("Piece of cake", 32, 64, 8, 16),
	new Difficulty("Easy", 16, 32, 4, 8),
	new Difficulty("Normal", 8, 16, 2, 4),
	new Difficulty("Hard", 4, 8, 1, 2),
	new Difficulty("Expert", 1, 2, 0, 1)
];
let difficulty = difficulties[2];
let difficultySlider = dom.createSlider(0, 4, 1, 2);
difficultySlider.style.width = width + "px";
difficultySlider.oninput = function(e) {
	difficulty = difficulties[this.value];
}
dom.append(dom.createBr());
dom.append(difficultySlider);

function restart() {
	havePlayed = true;
	difficultySlider.disabled = true;
	lives = 3;
	score = 0;
	justClicked = false;
	gameOver = false;
	differentBox = new Vector(randomInt(gridSize.x - 1), randomInt(gridSize.y - 1));
	randomizeColors();
}

function getBox(pos) {
	return pos.clone().subtract(gridLineWidth / 2).divide(boxSize).floor().clamp(physics.origin(), gridSize.clone().subtract(1));
}

function getRandomColor() {
	return [
		randomInt(360),
		randomInt(20, 80),
		randomInt(20, 80)
	];
}

function randomizeColors() {
	let [hue, sat, lgt] = getRandomColor();
	let hueModified = (hue + randomInt(difficulty.hueMin, difficulty.hueMax) * (coinFlip() ? 1 : -1)) % 360;
	let satModified = clamp(sat + randomInt(difficulty.satMin, difficulty.satMax) * (coinFlip() ? 1 : -1), 0, 100);
	let lgtModified = clamp(lgt + randomInt(difficulty.satMin, difficulty.satMax) * (coinFlip() ? 1 : -1), 0, 100);
	mainColor = `hsl(${hue}, ${sat}%, ${lgt}%)`;
	differentColor = `hsl(${hueModified}, ${satModified}%, ${lgtModified}%)`;
}

function drawLines(color = colors.BLACK) {
	stroke(color);
	lineWidth(gridLineWidth);
	// Vertical lines
	for(let x = 0; x < gridSize.x + 1; x++) {
		line(x * boxSize.x + gridLineWidth / 2, 0, x * boxSize.x + gridLineWidth / 2, height - scoreBoxHeight);
	}
	// Horizontal lines
	for(let y = 0; y < gridSize.y + 1; y++) {
		line(0, y * boxSize.y + gridLineWidth / 2, width, y * boxSize.y + gridLineWidth / 2);
	}
}

function fillAll(color) {
	fill(color);
	noStroke();
	rect(0, 0, width, height - scoreBoxHeight);
}

function fillBox(pos, color) {
	fill(color);
	noStroke();
	rect(pos.x * boxSize.x + gridLineWidth, pos.y * boxSize.y + gridLineWidth, boxSize.x - gridLineWidth, boxSize.y - gridLineWidth);
}

function outlineBox(pos, color) {
	noFill();
	stroke(color);
	lineWidth(gridLineWidth);
	rect(pos.x * boxSize.x + gridLineWidth / 2, pos.y * boxSize.y + gridLineWidth / 2, boxSize.x, boxSize.y);
}

function drawFooter() {
	fill(colors.WHITE);
	noStroke();
	font("Arial", 36);
	textAlign("alphabetic", "right");
	text(`Lives: ${lives}`, width - 10, height - 10);

	textAlign("left");
	text(`Score: ${score}`, 10, height - 10);

	textAlign("center");
	text(difficulty.name, midWidth, height - 10);
}

canvas.onmouseenter = e => {mouseInScene = true;}
canvas.onmouseleave = e => {mouseInScene = false;}

function click(e, button) {
	if(mouseY >= height - scoreBoxHeight) return;
	if(gameOver || !havePlayed) {
		restart();
		return;
	}
	if(justClicked || button !== "left") return;
	justClicked = true;
	clickedBox = getBox(mousePos);
	setTimeout(() => {
		justClicked = false;
		if(clickedBox.equals(differentBox)) score++;
		else if(--lives <= 0) {
			gameOver = true;
			difficultySlider.disabled = false;
		}

		differentBox = new Vector(randomInt(gridSize.x - 1), randomInt(gridSize.y - 1));
		randomizeColors();
	}, 500);
}

function render() {
	clear();

	if(gameOver) {
		fill(colors.WHITE);
		noStroke();
		rect(0, 0, width, height - scoreBoxHeight);

		fill(colors.BLACK);
		textAlign("center", "alphabetic");
		text(`You lost with a score of ${score}`, midWidth, (height - scoreBoxHeight) / 2 - 20);
		textAlign("hanging");
		text("Click anywhere to restart", midWidth, (height - scoreBoxHeight) / 2 + 20);
	}
	else if(!havePlayed) {
		fill(colors.WHITE);
		noStroke();
		rect(0, 0, width, height - scoreBoxHeight);

		fill(colors.BLACK);
		textAlign("center", "middle");
		text("Click anywhere to begin", midWidth, (height - scoreBoxHeight) / 2);
	}
	else {
		fillAll(mainColor);
		fillBox(differentBox, differentColor);
		drawLines();

		if(justClicked) {
			outlineBox(clickedBox, colors.RED);
			outlineBox(differentBox, colors.LIME);
		}
		else if(mouseInScene && mouseY <= height - scoreBoxHeight && !isDown("rightClick")) outlineBox(getBox(mousePos), colors.WHITE);
	}

	drawFooter();
}
