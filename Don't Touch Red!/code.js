let score = 0;
let subScore = 0;
let difficulty = 5;
let maxDiff = 40;
let orbs = [];
let alive = false;
let pos = new physics.Vector(-8, -8);

function spawnOrb() {
	orbs.push(new Orb());
	subScore++;
	if(subScore === 10) {
		subScore = 0;
		score++;
	}
}

function click() {
	if(!alive) {
		startGame();
	}
	else if(score >= 10) {
		score -= 10;
		orbs = [];
	}
}

function startGame() {
	canvas.style.cursor = "none";
	score = 0;
	subScore = 0;
	difficulty = 5;
	orbs = [];
	alive = true;
}
function endGame() {
	canvas.style.cursor = "auto";
	alive = false;
}

function tick() {
	if(!alive) return;

	pos.set(mousePos);
	if(math.chance(1 / 1000) && difficulty < maxDiff) difficulty++;
	if(math.percentChance(math.clamp(difficulty, 40))) spawnOrb();
	for(let i = 0; i < orbs.length; i++) {
		orbs[i].tick();
		if(orbs[i].dead) orbs.splice(i, 1);
	}
	for(let orb of orbs) {
		if(physics.circleInCircle(mousePos, 8, orb.pos, orb.rad)) {
			endGame();
		}
	}
}

function render() {
	background();

	for(let orb of orbs) orb.render();

	if(alive) {
		fill(255);
		noStroke();
		font("Arial", 32);
		textAlign("alphabetic", "start");
		text(`Score: ${score}`, 10, height - 10);
	}
	else {
		fill(255);
		noStroke();
		font("Arial", 48);
		if(score > 0) {
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

	fill(colors.CYAN);
	noStroke();
	point(pos, 8);
}
