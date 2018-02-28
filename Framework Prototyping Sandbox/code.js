let codeInput = document.getElementById("codeInput");
let frame = document.getElementById("frame");
let frameWindow = frame.contentWindow;
let frameDocument = frameWindow.document;
let frameHtmlTag = frameDocument.getElementsByTagName("html")[0];
let fontSize = 13;

let codeOn = "JS";
let defaultHTML = (
	`<html>
	<head>
		<meta charset="utf-8" />

		<script src="../iceFramework/ice/ice.math.js"></script>
		<script src="../iceFramework/ice/ice.physics.js"></script>
		<script src="../iceFramework/ice/ice.colors.js"></script>
		<script src="../iceFramework/ice/ice.debug.js"></script>
		<script src="../iceFramework/ice/ice.graphics.js"></script>
		<script src="../iceFramework/ice/ice.dom.js"></script>
		<script src="../iceFramework/ice/ice.time.js"></script>
		<script src="../iceFramework/ice/ice.audio.js"></script>
		<script src="https://caasinehc.github.io/ice/src/ice.math.js"></script>
		<script src="https://caasinehc.github.io/ice/src/ice.physics.js"></script>
		<script src="https://caasinehc.github.io/ice/src/ice.colors.js"></script>
		<script src="https://caasinehc.github.io/ice/src/ice.debug.js"></script>
		<script src="https://caasinehc.github.io/ice/src/ice.graphics.js"></script>
		<script src="https://caasinehc.github.io/ice/src/ice.dom.js"></script>
		<script src="https://caasinehc.github.io/ice/src/ice.time.js"></script>
		<script src="https://caasinehc.github.io/ice/src/ice.audio.js"></script>
	</head>
	<body>
		<canvas id="canvas" width=800 height=600 style="border: 4px solid black;">
			Your browser does not support the canvas element!
			Try upgrading to something like
			<a href="https://www.google.com/chrome/" target="_blank">Google Chrome</a>
		</canvas>

		<script src="../iceFramework/iceFramework.js"></script>
	</body>
</html>`
);
let defaultJS = (
	`function tick() {
	// tick
}
function render() {
	// render
}`
);
let html = localStorage.getItem("html");
if(html === null) {
	html = defaultHTML;
	localStorage.setItem("html", "html");
}
let js = localStorage.getItem("js");
if(js === null) {
	js = defaultJS;
	localStorage.setItem("js", "js");
}

function save() {
	localStorage.setItem("html", html);
	localStorage.setItem("js", js);
}
function restart() {
	html = defaultHTML;
	js = defaultJS;
	codeInput.value = codeOn === "HTML" ? html : js;
	save();
	compile();
}

function changeTo(which) {
	if(which === "HTML") {
		codeOn = "HTML";
		codeInput.value = html;
	}
	else if(which === "JS") {
		codeOn = "JS";
		codeInput.value = js;
	}
}

function addFontSize(n) {
	fontSize += n;
	if(fontSize < 6) fontSize = 6;
	else if(fontSize > 32) fontSize = 32;
	codeInput.style.fontSize = fontSize + "px";
}

function compile() {
	frame.onload = function() {
		console.clear();
		frameDocument = frameWindow.document;
		frameHtmlTag = frameDocument.getElementsByTagName("html")[0];

		frameDocument.open();
		frameDocument.write(html + `<script>${js}</script>`);
		frameDocument.close();
	}
	frameWindow.location.reload();
}

function updateCode() {
	if(codeOn === "HTML") {
		html = codeInput.value;
	}
	else if(codeOn === "JS") {
		js = codeInput.value;
	}
	save();
	compile();
}

codeInput.value = js;
codeInput.oninput = updateCode;
codeInput.onkeydown = function(e) {
	if(e.key === "Tab") {
		e.preventDefault();
		let val = this.value;
		let start = this.selectionStart;
		let end = this.selectionEnd;

		this.value = val.substring(0, start) + "\t" + val.substring(end);
		this.selectionStart = this.selectionEnd = start + 1;
	}
}

updateCode();

/*
function Orb(pos = new physics.Vector().randomize(physics.origin(), size), vel = physics.random(), rad = random(4, 16), color = colors.random()) {
	this.pos = pos;
	this.vel = vel;
	this.acc = new physics.Vector();
	this.rad = rad;
	this.mass = Math.PI * this.rad * this.rad;
	this.color = color;

	this.applyForce = function(force) {
		this.acc.add(force);
	}
	this.attract = function(orb) {
		let strength = orb.mass / this.pos.distSq(orb.pos);
		this.applyForce(orb.pos.clone().subtract(this.pos).setMag(strength));
	}
	this.repel = function(orb) {
		let strength = orb.mass / this.pos.distSq(orb.pos);
		this.applyForce(this.pos.clone().subtract(orb.pos).setMag(strength));
	}
	this.gravity = function() {
		for(let orb of orbs) {
			if(!orb.pos.equals(this.pos)) {
				if(
					physics.rectOnRect(
						this.pos.clone().subtract(this.rad), this.rad * 2, this.rad * 2,
						orb.pos.clone().subtract(orb.rad), orb.rad * 2, orb.rad * 2
					) && orb.pos.dist(this.pos) < this.rad + orb.rad
				) {
					//this.repel(orb);
					//this.pos.subtract(this.vel);
					//this.vel.invert();
				}
				else {
					this.attract(orb);
				}
			}
		}
	}
	this.tick = function() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.set(0);
		if(this.pos.x < this.rad || this.pos.x > width - this.rad) {
			this.vel.invertX();
			this.pos.clampX(this.rad, width - this.rad);
		}
		if(this.pos.y < this.rad || this.pos.y > height - this.rad) {
			this.vel.invertY();
			this.pos.clampY(this.rad, height - this.rad);
		}
	}
	this.render = function() {
		fill(this.color);
		noStroke();
		point(this.pos, this.rad);
	}
}
function getAverage() {
	let average = new physics.Vector();
	for(let orb of orbs) average.add(orb.pos);
	return average.divide(orbs.length);
}
function getCOM() {
	let com= new physics.Vector();
	let totalMass = 0;
	for(let orb of orbs) {
		com.add(orb.pos.clone().mult(orb.mass));
		totalMass += orb.mass;
	}
	return com.divide(totalMass );
}

let orbs = [];
for(let i = 0; i < 4; i++) {
	orbs.push(new Orb());
}

function tick() {
	for(let orb of orbs) orb.gravity();
	for(let orb of orbs) orb.tick();
	orbs[0].pos = middle.clone();
}

function render() {
	background();
	for(let orb of orbs) orb.render();
	//fill(255, 0, 0, 0.25);
	noStroke();
	//point(getAverage(), 8);
	//fill(255, 255, 0, 0.25);
	//point(getCOM(), 8);
	fill(colors.BLACK);
	textAlign("top", "right");
	text(fps, width, 0);
}

// https://gamedevelopment.tutsplus.com/tutorials/when-worlds-collide-simulating-circle-circle-collisions--gamedev-769

orbs = [
	new Orb(middle.clone().addY(000), new physics.Vector(0, 0), 16, colors.YELLOW),
	new Orb(middle.clone().addY(150), new physics.Vector(3, 0), 4, colors.BLUE),
	new Orb(middle.clone().addY(160), new physics.Vector(1.05, 0), 2, colors.GRAY)
]
*/
