canvas.style.cursor = "none";

let skeets = [];
let cooldown = 0;
let score = 0;
let lives = 5;
let alive = true;
let halloweenMode = false;
let sounds = {
	gunshot: "Assets/Audio/gunshot.mp3",
	reload: "Assets/Audio/reload.mp3"
}
let timing = {
	cooldown: floor(frameRate()),
	reload: floor(frameRate() * 0.25)
}
let cheats = {
	invul: false,
	lines: false,
	iNeverMiss: false,
	machineGun: false,
	magneto: false
}

function startGame() {
	skeets = [];
	cooldown = 0;
	lives = 5;
	alive = true;
}

function endGame() {
	alive = false;
}

function renderCursor() {
	fill(cooldown > timing.reload ? colors.RED : colors.BLACK);
	noStroke();
	rect(mouseX - 11, mouseY - 1, 22, 2);
	rect(mouseX - 1, mouseY - 11, 2, 22);

	stroke(fill());
	noFill();
	lineWidth(2);
	point(mousePos, 11);
}

function shoot() {
	audio.play(sounds.gunshot);
	let hit = 0;
	for(let skeet of skeets) {
		if(physics.pointInCircle(mousePos, skeet.pos, skeet.rad)) {
			skeet.dead = true;
			hit++;
		}
	}
	if(hit > 0) score += 5 ** (hit - 1);
}

function click(e, button) {
	if(cooldown <= 0 || cheats.machineGun) {
		cooldown = timing.cooldown;
		shoot();
	}
}

function tick() {
	if(!alive) return;
	if(lives <= 0) {
		endGame();
		return;
	}

	if(cooldown > 0) cooldown--;
	if(cooldown === timing.reload) audio.play(sounds.reload);

	if(skeets.length < 30 && math.chance(1 / 100)) skeets.push(new Skeet());

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

	for(let skeet of skeets) skeet.render();

	// recolor(colors.CERULEAN);

	fill(colors.RED);
	noStroke();
	rect(width - 150 - 10, height - 20 - 10, lives * 30, 20);

	noFill();
	stroke(0);
	lineWidth(2);
	rect(width - 150 - 10, height - 20 - 10, 150, 20);

	fill(0);
	noStroke();
	textAlign("right");
	text(`Life: `, width - 150 - 10, height - 10);

	renderCursor();

	fill(0);
	noStroke();
	font("Arial", 36);
	textAlign("alphabetic", "left");
	text(`Score: ${score}`, 10, height - 10);
}
