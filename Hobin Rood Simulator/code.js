let targetRad = 100;
let ringColors = [
	colors.YELLOW,
	colors.YELLOW,
	colors.RED,
	colors.RED,
	colors.CYAN,
	colors.CYAN,
	colors.BLACK,
	colors.BLACK
];
let ringScores = [
	100,
	50,
	20,
	10,
	5,
	2,
	1,
	0,
	-100
];

let aim = {
	maxBloom: 25,
	x: 0,
	y: 0,
	bloom: 0,
	vel: 5,
	stage: 0,
	cooldown: 0
}
let hit = new Vector();
let bullsEye = new Vector();
let score = 0;

function shoot() {
	hit = physics.random().multiply(random(aim.bloom)).addXY(aim.x, aim.y);
}

function getScore() {
	let d = hit.dist(bullsEye);
	let ringHit = floor(d / (targetRad / ringColors.length));
	if(ringHit > ringColors.length) ringHit = ringColors.length;
	return ringScores[ringHit];
}

function moveTarget() {
	bullsEye.x = random(targetRad, width - targetRad);
	bullsEye.y = random(targetRad, height - targetRad);
}

moveTarget();

function drawTarget() {
	let ringWidth = targetRad / ringColors.length;
	lineWidth(1);
	for(let ring = ringColors.length - 1; ring >= 0; ring--) {
		fill(ringColors[ring]);
		stroke(fill() === colors.BLACK ? colors.WHITE : colors.BLACK);
		point(bullsEye, (ring + 1) * ringWidth);
	}
	line(bullsEye.x - ringWidth / 2, bullsEye.y, bullsEye.x + ringWidth / 2, bullsEye.y);
	line(bullsEye.x, bullsEye.y - ringWidth / 2, bullsEye.x, bullsEye.y + ringWidth / 2);
}

function drawSights() {
	fill(colors.BLACK);
	noStroke();
	triangle(aim.x, height, 0, -20);
	if(aim.stage >= 1) {
		triangle(width, aim.y, -20, 0);
	}
	if(aim.stage >= 2) {
		noFill();
		stroke(colors.CHARCOAL);
		lineWidth(2);
		circle(aim.x, aim.y, aim.bloom);
	}
}

function drawArrow() {
	fill(colors.MAROON);
	stroke(colors.BLACK);
	point(hit, 4);
}

function click() {
	if(aim.stage === 0) {
		aim.stage++;
		aim.vel = 5;
	}
	else if(aim.stage === 1) {
		aim.stage++;
		aim.vel = 1;
	}
	else if(aim.stage === 2) {
		aim.stage++;
		shoot();
		score += getScore();
	}
}

function tick() {
	if(aim.stage === 0) {
		aim.x += aim.vel;
		if(aim.x >= width || aim.x <= 0) aim.vel *= -1;
	}
	else if(aim.stage === 1) {
		aim.y += aim.vel;
		if(aim.y >= height || aim.y <= 0) aim.vel *= -1;
	}
	else if(aim.stage === 2) {
		aim.bloom += aim.vel;
		if(aim.bloom >= aim.maxBloom || aim.bloom <= 0) aim.vel *= -1;
	}
	else if(aim.stage === 3) {
		if(aim.cooldown++ > 100) {
			aim.x = 0;
			aim.y = 0;
			aim.bloom = 0;
			aim.stage = 0;
			aim.vel = 5;
			aim.cooldown = 0;

			moveTarget();
		};
	}
}

function render() {
	background();

	drawTarget();
	drawSights();
	if(aim.stage === 3) drawArrow();

	fill(colors.BLACK);
	noStroke();
	textAlign("top right");
	text(score, width, 0);
}
