canvas.style.cursor = "none";

let skeets = [];
let cooldown = 0;
let halloweenMode = false;
let sounds = {
	gunshot: "Assets/Audio/gunshot.mp3",
	reload: "Assets/Audio/reload.mp3"
}
let timing = {
	cooldown: floor(frameRate()),
	reload: floor(frameRate() * 0.25)
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
	for(let skeet of skeets) {
		if(physics.pointInCircle(mousePos, skeet.pos, skeet.rad)) skeet.dead = true;
	}
}

function click(e, button) {
	if(cooldown <= 0) {
		cooldown = timing.cooldown;
		shoot();
	}
}

function tick() {
	if(math.chance(1 / 100)) skeets.push(new Skeet());

	if(cooldown > 0) cooldown--;
	if(cooldown === timing.reload) audio.play(sounds.reload);

	for(let i = skeets.length - 1; i >= 0; i--) {
		let skeet = skeets[i];
		skeet.tick();
		if(skeet.dead) skeets.splice(i, 1);
	}
}

function render() {
	// <TEMP>
	if(window.location.href.startsWith("file:///")) taint();
	// </TEMP>
	image("Assets/Images/background.png");

	for(let skeet of skeets) skeet.render();

	renderCursor();

	fill(0);
	noStroke();
	textAlign("bottom", "left");
	text(cooldown, 0, height);
}
