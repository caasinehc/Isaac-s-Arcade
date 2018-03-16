canvas.style.cursor = "none";

let skeets = [];
let cooldown = 0;
let score = 0;
let lives = 5;
let alive = true;
let halloweenMode = false;
let muted = false;
let sounds = {};
sounds.gunshot = "Assets/Audio/gunshot.mp3";
sounds.reload = "Assets/Audio/reload.mp3";
let timing = {};
timing.cooldown = floor(frameRate());
timing.reload = floor(frameRate() * 0.25);
let cheats = {};
cheats.invul = false;
cheats.lines = false;
cheats.iNeverMiss = false;
cheats.machineGun = false;
let powerups = {};
powerups.machineGun = 0;
powerups.freeze = 0;
powerups.scatter = 0;

function startGame() {
	skeets = [];
	cooldown = 0;
	score = 0;
	lives = 5;
	alive = true;
}

function endGame() {
	alive = false;
	cooldown = frameRate() * 2;
	for(let key in powerups) powerups[key] = 0;
}

function pull() {
	if(
		math.chance(1 / 10) &&
		powerups.machineGun === 0 &&
		powerups.freeze === 0 &&
		powerups.scatter === 0
	) skeets.push(new Skeet(random(["freeze", "medkit", "scatter", "machineGun"])));
	else skeets.push(new Skeet("normal"));
}

function cursorAt(pos) {
	fill(powerups.machineGun > 0 ? colors.GRAY : cooldown > timing.reload && alive ? colors.RED : colors.BLACK);
	noStroke();
	rect(pos.x - 11, pos.y - 1, 22, 2);
	rect(pos.x - 1, pos.y - 11, 2, 22);

	stroke(fill());
	noFill();
	lineWidth(2);
	point(pos, 11);
}

function renderCursor() {
	cursorAt(mousePos);
	if(powerups.scatter > 0) {
		cursorAt(mousePos.clone().addXY(20, 20));
		cursorAt(mousePos.clone().addXY(20, -20));
		cursorAt(mousePos.clone().addXY(-20, 20));
		cursorAt(mousePos.clone().addXY(-20, -20));
	}
}

function shoot() {
	if(!muted) audio.play(sounds.gunshot);
	let hit = 0;
	for(let skeet of skeets) {
		if(
			physics.pointInCircle(mousePos, skeet.pos, skeet.rad) ||
			powerups.scatter > 0 && (
				physics.pointInCircle(mousePos.clone().addXY(20, 20), skeet.pos, skeet.rad) ||
				physics.pointInCircle(mousePos.clone().addXY(20, -20), skeet.pos, skeet.rad) || 
				physics.pointInCircle(mousePos.clone().addXY(-20, 20), skeet.pos, skeet.rad) ||
				physics.pointInCircle(mousePos.clone().addXY(-20, -20), skeet.pos, skeet.rad)
			)
		) {
			skeet.dead = true;
			if(skeet.type === "freeze") powerups.freeze = frameRate() * 10;
			else if(skeet.type === "medkit") lives = clamp(lives + 1, 5);
			else if(skeet.type === "scatter") powerups.scatter = frameRate() * 10;
			else if(skeet.type === "machineGun") powerups.machineGun = frameRate() * 10;
			hit++;
		}
	}
	if(hit > 0) score += 5 ** (hit - 1);
}

function click(e, button) {
	if(physics.pointInRect(mousePos, physics.origin(), 30, 30)) {
		muted = !muted;
	}
	else {
		if(!alive && cooldown <= 0) {
			startGame();
		}
		else if(cooldown <= 0 || powerups.machineGun > 0) {
			cooldown = timing.cooldown;
			shoot();
		}
	}
}

function tick() {
	if(cooldown > 0) cooldown--;
	if(!alive) return;
	if(lives <= 0) {
		endGame();
		return;
	}

	if(cooldown === timing.reload && !muted) audio.play(sounds.reload);

	for(let key in powerups) {
		if(powerups[key] > 0) powerups[key]--;
	}

	if(skeets.length < 3 && math.chance(1 / 100)) pull();

	for(let i = skeets.length - 1; i >= 0; i--) {
		let skeet = skeets[i];
		skeet.tick();
		if(skeet.offTheMap && !cheats.invul) {
			lives--;
			skeets = [];
			break;
		}
		if(skeet.dead) skeets.splice(i, 1);
	}

	if(cheats.iNeverMiss && skeets.length > 0) {
		mousePos = skeets[0].pos.clone();
		mouseX = mousePos.x;
		mouseY = mousePos.y;
	}
}

function render() {
	// <TEMP>
	if(window.location.href.startsWith("file:///")) taint();
	// </TEMP>
	image("Assets/Images/background.png");
	image("Assets/Images/" + (muted ? "mute.png" : "sound.png"), 0, 0, 30, 30);

	for(let skeet of skeets) skeet.render();

	if(powerups.freeze > 0) recolor(colors.CERULEAN);

	fill(colors.RED);
	noStroke();
	rect(width - 150 - 10, height - 20 - 10, lives * 30, 20);

	noFill();
	stroke(0);
	lineWidth(2);
	rect(width - 150 - 10, height - 20 - 10, 150, 20);

	fill(0);
	noStroke();
	font("Arial", 36);
	textAlign("alphabetic", "right");
	text(`Life: `, width - 150 - 10, height - 10);

	textAlign("left");
	text(`Score: ${score}`, 10, height - 10);

	if(!alive) {
		textAlign("center", "alphabetic");
		text(`You lost with a score of ${score}`, midWidth, midHeight - 20);
		textAlign("hanging");
		text("Click anywhere to restart", midWidth, midHeight + 20);
	}

	renderCursor();
}
