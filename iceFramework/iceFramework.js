/*
 *	This is basically a long list of function shortcuts.
 *	I tried something more automatic, but
 *	scope/reference issues made it too complicated.
 *	And now I'm here. This is my life now.
 */

// The ice library
let {
	math, physics, colors, debug, graphics, dom, time, audio
} = ice;

// Math
let {
	E, LN2, LN10, PI, SQRT2, SQRT1_2,
	sqrt, cbrt, exp, pow, log, log10, log2,
	sin, cos, tan, asin, acos, atan, atan2,
	ceil, floor, abs, max, min, round, sign,
	hypot
} = Math;
const TAU = PI * 2;
let {
	randomInt, randomFloat, randomFrom, random,
	chance, percentChance, coinFlip,
	pythag, distSq, dist,
	map, clamp,
	isPrime, fibonacci,
	radToDeg, degToRad
} = math;

/* The main framework stuff */
const RGB = "rgb";
const HSL = "hsl";

// The scene
let scene = new graphics.Scene();
let {
	ctx, canvas, width, height, midWidth, midHeight,
	background, setBackground,/*resize,*/ fill, stroke,
	lineWidth, strokePattern, noFill, noStroke, font,
	textAlign, bold, italic, colorMode, angleMode,
	imagePrefix, rect, ellipse, circle, point, line,
	triangle, regPolygon, polygon, text, points,
	lines, taint, image, charts, clear, getPixel,
	setPixels, download, invert, grayscale, greyscale,
	sepia, brightness, contrast, blur, saturate,
	opacity, colorshift, recolor, save, restore
} = scene;
let size = new physics.Vector(scene.width, scene.height);
let middle = new physics.Vector(scene.midWidth, scene.midHeight);
function resize(w, h) {
	scene.resize(w, h);
	({width, height, midWidth, midHeight} = scene);
	size.x = width;
	size.y = height;
	middle.x = midWidth;
	middle.y = midHeight;
}

// The input listeners
function keyDown(e, key) {};
function keyUp(e, key) {};
(() => {
	let listener = new dom.InputListener(document.documentElement);
	isDown = listener.isDown;
	listener.keyDown = (e, key) => keyDown(e, key);
	listener.keyUp = (e, key) => keyUp(e, key);
})();

let mouseX = 0;
let mouseY = 0;
let prevMouseX = mouseX;
let prevMouseY = mouseY;
let mousePos = new physics.Vector(mouseX, mouseY);
let prevMousePos = new physics.Vector(prevMouseX, prevMouseY);
function mouseDown(e, button) {};
function mouseUp(e, button) {};
function click(e, button) {};
function mouseMove(e, x, y) {};
function wheel(e, dy) {};
(() => {
	let listener = new dom.InputListener(canvas);
	listener.mouseDown = (e, button) => mouseDown(e, button);
	listener.mouseUp = (e, button) => mouseUp(e, button);
	listener.click = (e, button) => click(e, button);
	listener.mouseMove = (e, x, y) => {
		({mouseX, mouseY, prevMouseX, prevMouseY} = listener);
		mousePos.x = mouseX;
		mousePos.y = mouseY;
		prevMousePos.x = prevMouseX;
		prevMousePos.y = prevMouseY;
		mouseMove(e, x, y);
	}
	listener.wheel = (e, dy) => wheel(e, dy);
})();
dom.showMenu(canvas, false);

// The clock
function tick() {};
function render() {};
(() => {
	let clock = new time.Clock();
	frameRate = clock.tickRate;
	setFrameRate = function(tickRate) {
		let retVal = clock.setTickRate(tickRate);
		frameRate = clock.tickRate;
		return retVal;
	}
	loop = () => clock.loop(true);
	noLoop = () => clock.loop(false);
	clock.tick = function() {
		fps = clock.tps;
		mspf = clock.mspt;
		dt = clock.dt;
		frameCount = clock.tickCount;
		fpsHistory = clock.tpsHistory;
		tick();
		render();
	}
})();
