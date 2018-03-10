let codeInput = document.getElementById("codeInput");
let tabSizeInput = document.getElementById("tabSizeInput");
let frame = document.getElementById("frame");
let frameWindow = frame.contentWindow;
let frameDocument = frameWindow.document;
let frameHtmlTag = frameDocument.getElementsByTagName("html")[0];

let codeOn = "JS";
let defaultHTML = (
`<html>
	<head>
		<meta charset="utf-8" />

		<script src="../iceFramework/ice/ice.math.js"><\/script>
		<script src="../iceFramework/ice/ice.physics.js"><\/script>
		<script src="../iceFramework/ice/ice.colors.js"><\/script>
		<script src="../iceFramework/ice/ice.debug.js"><\/script>
		<script src="../iceFramework/ice/ice.graphics.js"><\/script>
		<script src="../iceFramework/ice/ice.dom.js"><\/script>
		<script src="../iceFramework/ice/ice.time.js"><\/script>
		<script src="../iceFramework/ice/ice.audio.js"><\/script>
		<script src="https://caasinehc.github.io/ice/src/ice.math.js"><\/script>
		<script src="https://caasinehc.github.io/ice/src/ice.physics.js"><\/script>
		<script src="https://caasinehc.github.io/ice/src/ice.colors.js"><\/script>
		<script src="https://caasinehc.github.io/ice/src/ice.debug.js"><\/script>
		<script src="https://caasinehc.github.io/ice/src/ice.graphics.js"><\/script>
		<script src="https://caasinehc.github.io/ice/src/ice.dom.js"><\/script>
		<script src="https://caasinehc.github.io/ice/src/ice.time.js"><\/script>
		<script src="https://caasinehc.github.io/ice/src/ice.audio.js"><\/script>
	</head>
	<body>
		<canvas id="canvas" width=800 height=600 style="border: 4px solid black;">
			Your browser does not support the canvas element!
			Try upgrading to something like
			<a href="https://www.google.com/chrome/" target="_blank">Google Chrome</a>
		</canvas>

		<script src="../iceFramework/iceFramework.js"><\/script>
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
let html = localStorage.getItem(`${page}.html`);
if(html === null) {
	html = defaultHTML;
	localStorage.setItem(`${page}.html`, html);
}
let js = localStorage.getItem(`${page}.js`);
if(js === null) {
	js = defaultJS;
	localStorage.setItem(`${page}.js`, js);
}
let fontSize = localStorage.getItem(`${page}.fontSize`);
if(fontSize === null) {
	fontSize = 13;
	localStorage.setItem(`${page}.fontSize`, fontSize);
}
fontSize = parseInt(fontSize);
let tabSize = localStorage.getItem(`${page}.tabSize`);
if(tabSize === null) {
	tabSize = 4;
	localStorage.setItem(`${page}.tabSize`, tabSize);
}
tabSize = parseInt(tabSize);

function save() {
	localStorage.setItem(`${page}.html`, html);
	localStorage.setItem(`${page}.js`, js);
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
	localStorage.setItem(`${page}.fontSize`, fontSize);
	codeInput.style.fontSize = fontSize + "px";
}
function setTabSize() {
	size = this.value;
	if(size === "" || size % 1 !== 0 || size < 0 || size > 8) {
		tabSizeInput.value = tabSize;
		return;
	}
	tabSize = size;
	localStorage.setItem(`${page}.tabSize`, tabSize);
	codeInput.style.tabSize = tabSize;
}

function compile() {
	frame.onload = function() {
		console.clear();
		frameDocument = frameWindow.document;
		frameHtmlTag = frameDocument.getElementsByTagName("html")[0];

		frameDocument.open();
		frameDocument.write(html + `<script>${js}<\/script>`);
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

codeInput.style.fontSize = fontSize + "px";
tabSizeInput.value = tabSize;
tabSizeInput.oninput = setTabSize;
codeInput.style.tabSize = tabSize;
codeInput.value = js;
codeInput.oninput = updateCode;
codeInput.onkeydown = function(e) {
	let key = e.key;
	let ctrl = e.ctrlKey;
	if(key === "Tab") {
		e.preventDefault();
		let val = this.value;
		let start = this.selectionStart;
		let end = this.selectionEnd;

		this.value = val.substring(0, start) + "\t" + val.substring(end);
		this.selectionStart = this.selectionEnd = start + 1;
	}
	else if(key === "/" && ctrl) {
		// TODO Doesn't yet work for multiple lines
		e.preventDefault();
		let val = this.value;
		let start = this.selectionStart;
		let end = this.selectionEnd;
		let linesStart = val.lastIndexOf("\n", start - 1) + 1;
		let linesEnd = val.indexOf("\n", end);
		if(linesEnd === -1) linesEnd = val.length;
		let lines = val.substring(linesStart, linesEnd);
		if(start === end && false) {
			let commented = lines.trim().startsWith("//");

			if(commented) {
				this.value = val.substring(0, linesStart) + lines.replace(/(\t*)\/\/ ?(.*)/g, "$1$2") + val.substring(linesEnd);
				this.selectionStart = this.selectionEnd = start - 3;
			}
			else {
				this.value = val.substring(0, linesStart) + lines.replace(/(\t*)(.*)/, "$1// $2") + val.substring(linesEnd);
				this.selectionStart = this.selectionEnd = start + 3;
			}
		}
		else {
			let linesArr = lines.split("\n");
			let commentAll = false;
			for(let line of linesArr) {
				if(!line.trim().startsWith("//")) {
					commentAll = true;
					break;
				}
			}
			let offset = 0;
			let startOffset = 0;
			for(let i = 0; i < linesArr.length; i++) {
				let line = linesArr[i];
				let commented = line.trim().startsWith("//");

				if(commented) {
					if(!commentAll) {
						linesArr[i] = line.replace(/(\t*)\/\/ ?(.*)/g, "$1$2");
						offset -= 3;
						if(i === 0) startOffset -= 3;
					}
				}
				else {
					if(commentAll) {
						linesArr[i] = line.replace(/(\t*)(.*)/, "$1// $2");
						offset += 3;
						if(i === 0) startOffset += 3;
					}
				}
			}
			this.value = val.substring(0, linesStart) + linesArr.join("\n") + val.substring(linesEnd);
			this.selectionStart = start + startOffset;
			this.selectionEnd = end + offset;
		}
	}
}

updateCode();

/*
let drag = 0.99;
let debugInfo = false;

function Orb(rad = random(4, 64)) {
	this.pos = new physics.Vector().randomize(physics.origin(), size);
	this.vel = physics.random();
	this.acc = new physics.Vector();
	this.rad = rad;
	this.mass = Math.PI * this.rad * this.rad;
	this.color = colors.random();

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
	this.bounce = function(orb) {
		let dx = this.pos.x - orb.pos.x;
		let dy = this.pos.y - orb.pos.y;
		let dist = dx * dx + dy * dy;
		let vx = orb.vel.x - this.vel.x;
		let vy = orb.vel.y - this.vel.y;
		let dot = dx * vx + dy * vy;

		if(dot > 0) {
			this.pos.subtract(this.vel);
			orb.pos.subtract(orb.vel);

			let scale = dot / dist;
			let cx = dx * scale;
			let cy = dy * scale;
			let cw1 = 2 * orb.mass / (orb.mass + this.mass);
			let cw2 = 2 * this.mass / (orb.mass + this.mass);
			this.vel.x += cw1 * cx;
			this.vel.y += cw1 * cy;
			orb.vel.x -= cw2 * cx;
			orb.vel.y -= cw2 * cy;

			this.pos.add(this.vel);
			orb.pos.add(orb.vel);
		}
	}
	this.gravity = function() {
		for(let orb of orbs) {
			if(orb !== this) {
				if(orb.pos.distSq(this.pos) < (this.rad + orb.rad) ** 2) {}
				else this.attract(orb);
			}
		}
	}
	this.tick = function() {
		for(let orb of orbs) {
			if(orb.pos.distSq(this.pos) < (this.rad + orb.rad) ** 2) {
				this.bounce(orb);
			}
		}
		this.vel.add(this.acc);
		this.vel.multiply(drag);
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
for(let i = 0; i < 3; i++) {
	orbs.push(new Orb());
}

function tick() {
	for(let orb of orbs) orb.tick();
	for(let orb of orbs) orb.gravity();
}

function render() {
	background(0);
	for(let orb of orbs) orb.render();
	noStroke();
	if(debugInfo) {
		fill(255, 0, 0, 0.25);
		point(getAverage(), 8);
		fill(255, 255, 0, 0.25);
		point(getCOM(), 8);
	}
	fill(colors.WHITE);
	textAlign("top", "right");
	text(fps, width, 0);
}
*/
