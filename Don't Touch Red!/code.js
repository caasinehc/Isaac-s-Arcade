let score = 0;
let subScore = 0;
let difficulty = 5;
let maxDiff = 60;
let enemies = [];
let alive = false;
let pos = new physics.Vector(-8, -8);
let havePlayed = false;

let fair = true;
let cheats = {};
cheats.invul = false;
cheats.moneybags = false;
cheats.bot = false;

let bot = new Bot();

function spawnOrb() {
	enemies.push(new Orb());
	subScore++;
	if(subScore === 10) {
		subScore = 0;
		score++;
	}
}

function spawnSeeker() {
	enemies.push(new Seeker());
	score++;
}

function boardWipe() {
	if(score >= 10) {
		score -= 10;
		enemies = [];
	}
}

function mouseDown() {
	if(!alive) {
		startGame();
	}
	else if(cheats.bot) {
		endGame();
	}
	else boardWipe();
}

function startGame() {
	canvas.style.cursor = "none";
	if(cheats.bot) pos = middle.clone();
	havePlayed = true;
	score = 0;
	subScore = 0;
	difficulty = 5;
	enemies = [];
	alive = true;
}

function endGame() {
	canvas.style.cursor = "auto";
	alive = false;
}

function tick() {
	if(!alive) return;

	if(cheats.moneybags) score = Infinity;

	if(math.chance(1 / 1000) && difficulty < maxDiff) difficulty++;
	if(math.percentChance(math.clamp(difficulty, 40))) spawnOrb();
	if(math.percentChance(math.clamp(difficulty - 20, 40) / 10)) spawnSeeker();
	for(let i = 0; i < enemies.length; i++) {
		enemies[i].tick();
		if(enemies[i].dead) enemies.splice(i, 1);
	}

	if(!cheats.bot) pos.set(mousePos);
	else bot.tick(enemies);
	pos.clamp(physics.origin().add(8), size.clone().subtract(8));

	if(!cheats.invul) {
		for(let enemy of enemies) {
			if(physics.circleInCircle(pos, 8, enemy.pos, enemy.rad)) {
				endGame();
				break;
			}
		}
	}
	if(fair) {
		for(let cheat in cheats) {
			if(cheats[cheat]) fair = false;
		}
	}
}

function render() {
	background();

	fill(cheats.bot ? colors.YELLOW : colors.CYAN);
	noStroke();
	point(pos, 8);

	for(let enemy of enemies) enemy.render();

	if(alive) {
		fill(255);
		noStroke();
		font("Arial", 32);
		textAlign("alphabetic", "start");
		text(`Score: ${score}`, 10, height - 10);

		if(!fair) {
			textAlign("right");
			text("Cheats", width - 10, height - 10);
		}
	}
	else {
		fill(255);
		noStroke();
		font("Arial", 36);
		if(havePlayed) {
			textAlign("center", "alphabetic");
			text(`You lost with a score of ${score}`, midWidth, midHeight - 20);
			textAlign("hanging");
			text("Click anywhere to restart", midWidth, midHeight + 20);
		}
		else {
			textAlign("center", "middle");
			text("Click anywhere to begin", midWidth, midHeight);
		}
	}
}
