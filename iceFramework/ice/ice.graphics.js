if(typeof ice === "undefined") ice = {modules: []};
(function() {
	if(!ice.modules.includes("graphics")) ice.modules.push("graphics");
	ice.graphics = {};
	ice.graphics.version = "v2.2.14"; // This version of the ice.graphics module
	console.log("%cice.graphics " + ice.graphics.version + " imported successfully.", "color: #008000");

	/*
	 *	================ Graphics Module ================
	 */

	/*
	 *	TODO:
	 *		curve
	 *		scale, transform, rotate, and all that unnecessarily complicated bullsh*t
	 *		charts: bar
	 *		renew (un-taints canvas by scrapping it and creating a new one)
	 */

	// Private variables/functions

	let TAU = Math.PI * 2;
	let WHITE = "#FFFFFF";
	let BLACK = "#000000";
	let SILVER = "#C0C0C0";
	let TRANSPARENT = "rgba(0, 0, 0, 0)";
	let DEG120 = degToRad(120);
	let DEG240 = degToRad(240);
	let SIN120 = Math.sin(DEG120);
	let COS120 = Math.cos(DEG120);
	let SIN240 = Math.sin(DEG240);
	let COS240 = Math.cos(DEG240);
	let DEG45 = degToRad(45);
	let SIN45 = Math.sin(DEG45);
	let COS45 = Math.cos(DEG45);

	function degToRad(n) {
		return n * (Math.PI / 180);
	}

	function interpretCtx(input) {
		if(input === undefined) {
			return document.querySelector("canvas").getContext("2d");
		}
		if(typeof input === "string") {
			let possibleCanvas = document.querySelector(input);
			if(possibleCanvas instanceof HTMLCanvasElement) {
				return possibleCanvas.getContext("2d");
			}
		}
		else if(input instanceof HTMLCanvasElement) {
			return input.getContext("2d");
		}
		return input;
	}

	// Constructors

	ice.graphics.Scene = function(ctxInput) {
		if(!(this instanceof ice.graphics.Scene)) {
			return new ice.graphics.Scene(ctxInput);
		}

		this.ctx = interpretCtx(ctxInput);
		this.canvas = this.ctx.canvas;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.midWidth = this.width / 2;
		this.midHeight = this.height / 2;

		let canvas = this.canvas;
		let ctx = this.ctx;
		let imgMem = {};
		let tainted = false;

		let settings = {};
		settings.bgColor = WHITE;
		settings.fill = SILVER;
		settings.stroke = BLACK;
		settings.lineWidth = 2;
		settings.strokePattern = [];
		settings.fontFamily = "Verdana";
		settings.fontSize = 24;
		settings.textAlign = "start";
		settings.textBaseline = "alphabetic";
		settings.bold = false;
		settings.italic = false;
		settings.colorMode = "rgb";
		settings.angleMode = "radians";
		settings.imagePrefix = ""; // "https://cors-anywhere.herokuapp.com/" is a good one

		let bufferCanvas = document.createElement("canvas");
		bufferCanvas.width = this.width;
		bufferCanvas.height = this.height;
		let bufferCtx = bufferCanvas.getContext("2d");

		function interpretColor(arg1, arg2, arg3, arg4, defaultColor) {
			if(arg1 === undefined) {
				return defaultColor === undefined ? WHITE : defaultColor;
			}
			modeIsRGB = settings.colorMode === "rgb";
			let arg1IsNumber = typeof arg1 === "number";
			if(arg2 === undefined) {
				if(arg1IsNumber) {
					if(modeIsRGB) {
						return "rgb(" + arg1 + ", " + arg1 + ", " + arg1 + ")";
					}
					return "hsl(" + arg1 + ", 100%, 50%)";
				}
				if(arg1 instanceof Array || arg1 instanceof Uint8ClampedArray) {
					return interpretColor(arg1[0], arg1[1], arg1[2], arg1[3], defaultColor);
				}
				return arg1;
			}
			else if(arg3 === undefined) {
				if(modeIsRGB) {
					return "rgba(" + arg1 + ", " + arg1 + ", " + arg1 + ", " + arg2 + ")";
				}
				return "hsla(" + arg1 + ", 100%, 50%, " + arg2 + ")";
			}
			else if(arg4 === undefined) {
				if(modeIsRGB) {
					return "rgb(" + arg1 + ", " + arg2 + ", " + arg3 + ")";
				}
				let typeofArg2 = typeof arg2;
				let typeofArg3 = typeof arg3;
				if(typeofArg2 === "number" || (typeofArg2 === "string" && !arg2.endsWith("%"))) arg2 += "%";
				if(typeofArg3 === "number" || (typeofArg3 === "string" && !arg3.endsWith("%"))) arg3 += "%";
				return "hsl(" + arg1 + ", " + arg2 + ", " + arg3 + ")";
			}
			if(modeIsRGB) {
				return "rgba(" + arg1 + ", " + arg2 + ", " + arg3 + ", " + arg4 + ")";
			}
			let typeofArg2 = typeof arg2;
			let typeofArg3 = typeof arg3;
			if(typeofArg2 === "number" || (typeofArg2 === "string" && !arg2.endsWith("%"))) arg2 += "%";
			if(typeofArg3 === "number" || (typeofArg3 === "string" && !arg3.endsWith("%"))) arg3 += "%";
			return "hsla(" + arg1 + ", " + arg2 + ", " + arg3 + ", " + arg4 + ")";
		}

		function rgbToHsl(r, g, b, a) {
			if(r === undefined) {
				return [0, 0, 0, 0];
			}
			else if(g === undefined) {
				if(typeof r === "string") {
					let rgbaArray = r.replace(/[^\d,.]/g, "").split(",");
					for(let i = 0; i < rgbaArray.length; i++) {
						rgbaArray[i] = parseFloat(rgbaArray[i]);
					}
					return rgbToHsl(rgbaArray[0], rgbaArray[1], rgbaArray[2], rgbaArray[3]);
				}
				if(r instanceof Array || r instanceof Uint8ClampedArray) {
					return rgbToHsl(r[0], r[1], r[2], r[3]);
				}
				g = r;
				b = r;
				a = 1;
			}
			else if(b === undefined) {
				g = r;
				b = r;
				a = g;
			}
			else if(a === undefined) {
				a = 1;
			}
			r /= 255;
			g /= 255;
			b /= 255;

			let max = Math.max(r, g, b);
			let min = Math.min(r, g, b);
			let l = (max + min) * 50;

			if(max == min) return [0, 0, l, a];

			let diff = max - min;
			s = 100 * diff / (l > 50 ? 2 - max - min : max + min);
			if(max === r) h = 60 * (g - b) / diff + (g < b ? 360 : 0);
			else if(max === g) h = 60 * (b - r) / diff + 120;
			else if(max === b) h = 60 * (r - g) / diff + 240;

			return [h, s, l, a];
		}

		function hslToRgb(h, s, l, a) {
			if(h === undefined) {
				return [0, 0, 0, 0];
			}
			else if(s === undefined) {
				if(typeof h === "string") {
					let hslaArray = h.replace(/[^\d,.]/g, "").split(",");
					for(let i = 0; i < hslaArray.length; i++) {
						hslaArray[i] = parseFloat(hslaArray[i]);
					}
					return hslToRgb(hslaArray[0], hslaArray[1], hslaArray[2], hslaArray[3]);
				}
				if(h instanceof Array || h instanceof Uint8ClampedArray) {
					return hslToRgb(h[0], h[1], h[2], h[3]);
				}
				s = 100;
				l = 50;
				a = 1;
			}
			else if(l === undefined) {
				a = s;
				s = 100;
				l = 50;
			}
			else if(a === undefined) {
				a = 1;
			}

			if(s === 0) {
				l *= 255 / 100;
				return [l, l, l, a];
			}

			h /= 360;
			s /= 100;
			l /= 100;

			function hue2rgb(p, q, t) {
				t = (t + 1) % 1;
				if(t < 1 / 6) return p + (q - p) * 6 * t;
				if(t < 1 / 2) return q;
				if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			}

			let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			let p = 2 * l - q;

			return [
				Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
				Math.round(hue2rgb(p, q, h) * 255),
				Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
				a
			];
		}

		function hexToRgb(hex) {
			hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i, (m, r, g, b, a) => {
				a = a === undefined ? "F" : a;
				return r + r + g + g + b + b + a + a;
			});

			let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
			if(result === null) return [0, 0, 0, 0];
			result[4] = result[4] === undefined ? "FF" : result[4]
			return [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16),
				parseInt(result[4], 16) / 255
			];
		}

		function rgbToHex(r, g, b, a) {
			if(r === undefined) return "#00000000";
			else if(g === undefined) {
				if(typeof r === "string") {
					let rgbaArray = r.replace(/[^\d,.]/g, "").split(",");
					for(let i = 0; i < rgbaArray.length; i++) {
						rgbaArray[i] = parseFloat(rgbaArray[i]);
					}
					return rgbToHex(rgbaArray[0], rgbaArray[1], rgbaArray[2], rgbaArray[3]);
				}
				if(r instanceof Array || r instanceof Uint8ClampedArray) {
					return rgbToHex(r[0], r[1], r[2], r[3]);
				}
			}
			else if(b === undefined) {
				a = g;
				g = r;
				b = r;
			}
			r = r.toString(16);
			r = r.length === 1 ? "0" + r : r;
			g = g.toString(16);
			g = g.length === 1 ? "0" + g : g;
			b = b.toString(16);
			b = b.length === 1 ? "0" + b : b;
			let rgb = "#" + r + g + b;
			if(a !== undefined) {
				a = parseInt(a * 255).toString(16);
				a = a.length === 1 ? "0" + a : a;
				rgb += a;
			}
			return rgb;
		}

		function hslToHex(h, s, l, a) {
			return rgbToHex(hslToRgb(h, s, l, a));
		}

		function hexToHsl(hex) {
			return rgbToHsl(hexToRgb(hex));
		}

		function applyCssFilter(filter, value) {
			ctx.save();
			bufferCtx.drawImage(canvas, 0, 0);
			ctx.clearRect(0, 0, this.width, this.height);
			ctx.filter = filter + "(" + value + ")";
			ctx.drawImage(bufferCanvas, 0, 0);
			ctx.restore();
		}

		function prepFill() {
			if(settings.fill) {
				ctx.fillStyle = settings.fill;
				return true;
			}
			return false;
		}

		function prepStroke() {
			if(settings.stroke) {
				ctx.strokeStyle = settings.stroke;
				ctx.lineWidth = settings.lineWidth;
				ctx.setLineDash(settings.strokePattern);
				return true;
			}
			return false;
		}

		function renderPath() {
			if(prepFill()) {
				ctx.fill();
			}
			if(prepStroke()) {
				ctx.stroke();
			}
		}
		this.background = (arg1, arg2, arg3, arg4) => {
			this.ctx.fillStyle = interpretColor(arg1, arg2, arg3, arg4, settings.bgColor);
			this.ctx.fillRect(0, 0, this.width, this.height);
		}
		this.setBackground = (arg1, arg2, arg3, arg4) => {
			return settings.bgColor = interpretColor(arg1, arg2, arg3, arg4, settings.bgColor);
		}
		this.resize = (w, h = w) => {
			this.width = this.canvas.width = w;
			this.height = this.canvas.height = h;
			this.midWidth = this.width / 2;
			this.midHeight = this.height / 2;
			bufferCanvas.width = this.width;
			bufferCanvas.height = this.height;
		}
		this.fill = (arg1, arg2, arg3, arg4) => {
			return settings.fill = interpretColor(arg1, arg2, arg3, arg4, settings.fill);
		}
		this.stroke = (arg1, arg2, arg3, arg4) => {
			return settings.stroke = interpretColor(arg1, arg2, arg3, arg4, settings.stroke);
		}
		this.lineWidth = width => {
			return settings.lineWidth = width === undefined ? settings.lineWidth : width;
		}
		this.strokePattern = pattern => {
			return settings.strokePattern = pattern === undefined ? settings.strokePattern : pattern;
		}
		this.noFill = () => {
			settings.fill = false;
		}
		this.noStroke = () => {
			settings.stroke = false;
		}
		this.font = (arg1, arg2) => {
			if(typeof arg1 === "string") {
				settings.fontFamily = arg1;
				if(typeof arg2 === "number") {
					settings.fontSize = arg2;
				}
			}
			else if(typeof arg1 === "number") {
				settings.fontSize = arg1;
				if(typeof arg2 === "string") {
					settings.fontFamily = arg2;
				}
			}
			return getFont(false);
		}

		function getFont(asString) {
			if(asString) {
				let font = "";
				if(settings.italic) font += "italic ";
				if(settings.bold) font += "bold ";
				font += settings.fontSize + "px ";
				font += settings.fontFamily;
				return font;
			}
			return [settings.fontSize, settings.fontFamily, settings.italic, settings.bold];
		}
		this.textAlign = (arg1, arg2) => {
			if(arg1 !== undefined && arg2 === undefined && (arg1.includes(" ") || arg1.includes(","))) [arg1, arg2] = arg1.split(/[ ,]+/)
			if(arg1 === "left" || arg1 === "right" || arg1 === "center" || arg1 === "start" || arg1 === "end") {
				settings.textAlign = arg1;
				if(arg2 === "top" || arg2 === "hanging" || arg2 === "middle" || arg2 === "alphabetic" || arg2 === "ideographic" || arg2 === "bottom") {
					settings.textBaseline = arg2;
				}
			}
			else if(arg1 === "top" || arg1 === "hanging" || arg1 === "middle" || arg1 === "alphabetic" || arg1 === "ideographic" || arg1 === "bottom") {
				settings.textBaseline = arg1;
				if(arg2 === "left" || arg2 === "right" || arg2 === "center" || arg2 === "start" || arg2 === "end") {
					settings.textAlign = arg2;
				}
			}
			return [settings.textBaseline, settings.textAlign];
		}
		this.bold = bold => {
			if(bold === undefined) return settings.bold;
			settings.bold = bold;
		}
		this.italic = italic => {
			if(italic === undefined) return settings.italic;
			settings.italic = italic;
		}
		this.colorMode = mode => {
			if(typeof mode === "string") {
				mode = mode.toLowerCase();
			}
			if(mode === "rgb" || mode === "hsl") {
				settings.colorMode = mode;
			}
			return settings.colorMode;
		}
		this.angleMode = mode => {
			if(typeof mode === "string") {
				mode = mode.toLowerCase();
			}
			if(mode === "radians" || mode === "degrees") {
				settings.angleMode = mode;
			}
			return settings.angleMode;
		}
		this.imagePrefix = prefix => {
			if(prefix === undefined) return settings.imagePrefix;
			return settings.imagePrefix = prefix;
		}
		this.rect = (x, y, w, h = w) => {
			if(prepFill()) this.ctx.fillRect(x, y, w, h);
			if(prepStroke()) this.ctx.strokeRect(x, y, w, h);
		}
		this.ellipse = (x, y, w, h = w, ang = 0) => {
			if(settings.angleMode === "degrees") ang = degToRad(ang);
			this.ctx.beginPath();
			this.ctx.ellipse(x, y, w, h, ang, 0, TAU)
			renderPath();
		}
		this.circle = (x, y, rad = 8) => {
			this.ctx.beginPath();
			this.ctx.arc(x, y, rad, 0, TAU);
			renderPath();
		}
		this.point = (pos, size = 1) => {
			this.circle(pos.x, pos.y, size);
		}
		this.line = (x1, y1, x2, y2) => {
			this.ctx.beginPath();
			if(x2 === undefined) {
				this.ctx.moveTo(x1.x, x1.y);
				this.ctx.lineTo(y1.x, y1.y);
			}
			else {
				this.ctx.moveTo(x1, y1);
				this.ctx.lineTo(x2, y2);
			}
			renderPath();
		}
		this.triangle = (cx, cy, v1x, v1y) => {
			if(v1y === undefined) {
				v1y = v1x;
				v1x = 0;
			}

			let v2x = v1x * COS120 - v1y * SIN120;
			let v2y = v1x * SIN120 + v1y * COS120;
			let v3x = v1x * COS240 - v1y * SIN240;
			let v3y = v1x * SIN240 + v1y * COS240;

			this.ctx.beginPath();
			this.ctx.moveTo(cx + v1x, cy + v1y);
			this.ctx.lineTo(cx + v2x, cy + v2y);
			this.ctx.lineTo(cx + v3x, cy + v3y);
			this.ctx.closePath();
			renderPath();
		}
		this.regPolygon = (x, y, sides, rad, rotation = 0) => {
			sides = Math.floor(sides);
			if(sides <= 1) {
				this.circle(x, y, rad);
				return;
			}
			if(settings.angleMode === "degrees") rotation = degToRad(rotation);
			rotation -= TAU / 4;
			this.ctx.beginPath();
			this.ctx.moveTo(x + (Math.cos(rotation) * rad), y + (Math.sin(rotation) * rad));
			for(let angle = TAU / sides; angle < TAU; angle += TAU / sides) {
				this.ctx.lineTo(
					x + (Math.cos(angle + rotation) * rad),
					y + (Math.sin(angle + rotation) * rad)
				);
			}
			this.ctx.closePath();
			renderPath();
		}
		this.polygon = points => {
			if(!points instanceof Array) points = arguments;
			if(points.length <= 0) return;
			if(points.length === 1) {
				this.point(points[0]);
				return;
			}
			this.ctx.beginPath();
			this.ctx.moveTo(points[0].x, points[0].y);
			for(let i = 1; i < points.length; i++) {
				this.ctx.lineTo(points[i].x, points[i].y);
			}
			this.ctx.closePath();
			renderPath();
		}
		this.text = (text, x, y, maxWidth) => {
			ctx.font = getFont(true);
			ctx.textAlign = settings.textAlign;
			ctx.textBaseline = settings.textBaseline;
			if(prepFill()) ctx.fillText(text, x, y, maxWidth);
			if(prepStroke()) ctx.strokeText(text, x, y, maxWidth);
		}
		this.points = (points, size = 1) => {
			for(let point of points) this.point(point, size);
		}
		this.lines = points => {
			if(!points instanceof Array) points = arguments;
			if(points.length <= 0) return;
			if(points.length === 1) {
				this.point(points[0]);
				return;
			}
			this.ctx.beginPath();
			this.ctx.moveTo(points[0].x, points[0].y);
			for(let i = 1; i < points.length; i++) {
				this.ctx.lineTo(points[i].x, points[i].y);
			}
			if(prepStroke()) ctx.stroke();
		}

		function cachedImage(src) {
			this.src = src;
			this.img = new Image();
			this.ready = false;

			let callbacks = [];

			function executeCallbacks() {
				for(let callback of callbacks) {
					callback();
				}
				callbacks = [];
			}

			this.img.onload = e => {
				this.ready = true;
				executeCallbacks();
			}
			if(!tainted) {
				this.img.crossOrigin = "anonymous";
				if(settings.imagePrefix.length > 0) {
					this.src = settings.imagePrefix + this.src;
				}
			}
			this.img.src = this.src;

			this.addCallback = callback => {
				if(typeof callback !== "function") return;
				if(this.ready) {
					callback();
				}
				else {
					if(callbacks.length > 100) {
						return;
					}
					callbacks.push(callback);
				}
			}

			this.reload = () => {
				this.img = new Image();
				this.ready = false;

				this.img.onload = () => {
					this.ready = true;
					executeCallbacks();
				}
				if(!tainted) {
					this.img.crossOrigin = "anonymous";
				}
				this.img.src = this.src;
			}
		}
		this.taint = () => {tainted = true;}
		this.image = (img, x = 0, y = 0, w = this.width, h = this.height, sx, sy, sw, sh) => {
			if(typeof img === "string") {
				if(imgMem[img] === undefined) {
					imgMem[img] = new cachedImage(img);
				}
				if(!imgMem[img].ready) {
					imgMem[img].addCallback(() => {
						this.image(img, x, y, w, h, sx, sy, sw, sh);
					});
					return;
				}
				img = imgMem[img].img;
			}
			if(sx === undefined) this.ctx.drawImage(img, x, y, w, h);
			else this.ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
		}

		function pieChart(x, y, rad, dataIn, rotation, donut, meter) {
			let data = {
				rings: [],
				ringTotal: 0
			};
			let ringsIn = dataIn.rings === undefined ? [{
				slices: dataIn.slices
			}] : dataIn.rings;
			for(let ring of ringsIn) {
				let slices = [];
				let total = 0;
				let lineWidth = 0;
				if(ring.lineWidth !== undefined) lineWidth = ring.lineWidth;
				else if(ring.width !== undefined) lineWidth = ring.width;
				let size = 1;
				if(ring.size !== undefined) size = ring.size;
				else if(ring.value !== undefined) size = ring.value;
				else if(ring.data !== undefined) size = ring.data;
				if(size < 0) size = 0;
				let slicesIn = ring.slices === undefined ? [] : ring.slices;
				for(let slice of slicesIn) {
					let sliceSize = 1;
					if(slice.size !== undefined) sliceSize = slice.size;
					else if(slice.value !== undefined) sliceSize = slice.value;
					else if(slice.data !== undefined) sliceSize = slice.data;
					if(sliceSize < 0) sliceSize = 0;
					let color = slice.color === undefined ? typeof slice === "string" ? slice : TRANSPARENT : slice.color;
					let border = slice.border === undefined ? BLACK : slice.border;
					let sliceLineWidth = 0;
					if(slice.lineWidth !== undefined) sliceLineWidth = slice.lineWidth;
					else if(slice.width !== undefined) sliceLineWidth = slice.width;
					slices.push({
						size: sliceSize,
						color: color,
						border: border,
						lineWidth: sliceLineWidth
					});
					total += sliceSize;
				}
				if(meter) total *= 2;
				data.rings.push({
					size: size,
					slices: slices,
					lineWidth: lineWidth,
					sliceTotal: total
				});
				data.ringTotal += size;
			}
			if(donut) data.ringTotal *= 2;

			let offsetRad = rad;
			bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
			for(let ring of data.rings) {
				let thisRad = rad * (ring.size / data.ringTotal);
				let offsetAngle = rotation;
				for(let slice of ring.slices) {
					let thisAngle = (TAU * slice.size / ring.sliceTotal);
					bufferCtx.beginPath();
					bufferCtx.moveTo(x, y);
					bufferCtx.arc(x, y, offsetRad, offsetAngle, thisAngle + offsetAngle);
					bufferCtx.closePath();
					bufferCtx.fillStyle = slice.color;
					bufferCtx.fill();
					if(slice.lineWidth) {
						bufferCtx.strokeStyle = slice.border;
						bufferCtx.lineWidth = slice.lineWidth;
						bufferCtx.stroke();
					}
					offsetAngle += thisAngle;
				}
				bufferCtx.save();
				if(ring.lineWidth) {
					bufferCtx.beginPath();
					bufferCtx.arc(x, y, offsetRad, 0, TAU);
					bufferCtx.strokeStyle = ring.border;
					bufferCtx.lineWidth = ring.lineWidth;
					bufferCtx.stroke();
				}
				offsetRad -= thisRad;
				if(offsetRad < 0) offsetRad = 0;
				bufferCtx.beginPath();
				bufferCtx.arc(x, y, offsetRad, 0, TAU);
				bufferCtx.globalCompositeOperation = "destination-out";
				bufferCtx.fillStyle = BLACK;
				bufferCtx.fill();
				bufferCtx.restore();
			}
			ctx.drawImage(bufferCanvas, 0, 0);
		}
		this.charts = {};
		this.charts.pie = (x, y, rad, dataIn, rotation = 0) => {
			if(settings.angleMode === "degrees") rotation = degToRad(rotation);
			rotation -= TAU / 4;
			pieChart(x, y, rad, dataIn, rotation);
		}
		this.charts.donut = (x, y, rad, dataIn, rotation = 0) => {
			if(settings.angleMode === "degrees") rotation = degToRad(rotation);
			rotation -= TAU / 4;
			pieChart(x, y, rad, dataIn, rotation, true);
		}
		this.charts.meter = (x, y, rad, dataIn, rotation = 0, text) => {
			if(settings.angleMode === "degrees") rotation = degToRad(rotation);
			rotation -= TAU / 2;
			pieChart(x, y, rad, dataIn, rotation, true, true);
			if(text !== undefined) {
				let font = "";
				if(settings.italic) font += "italic ";
				if(settings.bold) font += "bold ";
				font += rad / 2 + "px ";
				font += settings.fontFamily;
				ctx.font = font;
				ctx.textAlign = "center";
				ctx.textBaseline = "alphabetic";
				let maxWidth = rad * COS45;
				if(prepFill()) ctx.fillText(text, x, y, maxWidth);
				if(prepStroke()) ctx.strokeText(text, x, y, maxWidth);
			}
		}
		function lineChart(x, y, w, h, dataIn, line) {
			let data = {};
			data.groups = dataIn.groups === undefined ? [{points: dataIn.points}] : dataIn.groups;
			data.borderColor = dataIn.borderColor === undefined ? BLACK : dataIn.borderColor;
			data.borderWidth = dataIn.borderWidth === undefined ? 2 : dataIn.borderWidth;
			data.backgroundColor = dataIn.backgroundColor === undefined ? WHITE : dataIn.backgroundColor;
			data.scaleX = dataIn.scaleX === undefined ? 1 : dataIn.scaleX;
			data.scaleY = dataIn.scaleY === undefined ? 1 : dataIn.scaleY;
			data.gridSize = dataIn.gridSize === undefined ? 0 : dataIn.gridSize;
			data.gridColor = dataIn.gridColor === undefined ? SILVER : dataIn.gridColor;
			data.gridWidth = dataIn.gridWidth === undefined ? 1 : dataIn.gridWidth;

			bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

			bufferCtx.strokeStyle = data.borderColor;
			bufferCtx.lineWidth = data.borderWidth * 2;
			bufferCtx.strokeRect(x, y, w, h);
			bufferCtx.fillStyle = data.backgroundColor;
			bufferCtx.fillRect(x, y, w, h);

			if(data.gridSize > 0) {
				bufferCtx.strokeStyle = data.gridColor;
				bufferCtx.lineWidth = data.gridWidth;
				bufferCtx.beginPath();
				for(let i = y; i < y + h; i += data.gridSize * data.scaleY) {
					bufferCtx.moveTo(x, i);
					bufferCtx.lineTo(x + w, i);
				}
				for(let i = x; i < x + w; i += data.gridSize * data.scaleX) {
					bufferCtx.moveTo(i, y);
					bufferCtx.lineTo(i, y + h);
				}
				bufferCtx.stroke();
			}

			y += h;
			bufferCtx.lineJoin = "round";
			for(let group of data.groups) {
				group.color = group.color === undefined ? BLACK : group.color;
				group.size = group.size === undefined ? 2 : group.size;
				group.lineColor = group.lineColor === undefined ? group.color : group.lineColor;
				group.lineWidth = group.lineWidth === undefined ? 1 : group.lineWidth;
				if(line) {
					bufferCtx.strokeStyle = group.lineColor;
					bufferCtx.lineWidth = group.lineWidth;
					bufferCtx.beginPath();
					for(let point of group.points) {
						bufferCtx.lineTo(point.x * data.scaleX + x, y - data.scaleY * point.y);
					}
					bufferCtx.stroke();
				}

				bufferCtx.fillStyle = group.color;
				bufferCtx.beginPath();
				for(let point of group.points) {
					bufferCtx.moveTo(point.x * data.scaleX + x, y - data.scaleY * point.y);
					bufferCtx.arc(point.x * data.scaleX + x, y - data.scaleY * point.y, group.size, 0, TAU);
				}
				bufferCtx.fill();
			}
			ctx.drawImage(bufferCanvas, x, y - h, w, h, x, y - h, w, h);
		}
		this.charts.scatter = (x, y, w, h, dataIn) => {
			lineChart(x, y, w, h, dataIn, false);
		}
		this.charts.line = (x, y, w, h, dataIn) => {
			lineChart(x, y, w, h, dataIn, true);
		}
		this.charts.presets = {};
		// These are just for the lols
		this.charts.presets.PYRAMID = {
			rings: [
				{
					lineWidth: 1,
					slices: [
						{
							color: "#80C0FF",
							size: 6
						}, // Sky
						{
							color: "#705000",
							size: 1,
							lineWidth: 1
						}, // Shady side
						{
							color: "#FFD060",
							size: 3,
							lineWidth: 1
						}, // Sunny side
						{
							color: "#80C0FF",
							size: 6
						} // Sky
					]
				}
			]
		};
		this.charts.presets.PACMAN = {
			slices: [
				{
					color: "yellow",
					size: 3
				}, // Eyes area (yellow)
				{
					color: "black",
					size: 4
				}, // Mouth
				{
					color: "yellow",
					size: 3
				}, // Chin area (yellow)
				{
					color: "yellow",
					size: 10
				} // Body area (yellow)
			]
		};
		this.charts.presets.PACMAN2 = {
			slices: [
				{
					color: "yellow",
					size: 3
				}, // Eyes area (yellow)
				{
					color: "#FE0000",
					size: 1
				}, // Blinky
				{
					color: "#00CDFF",
					size: 1
				}, // Inky
				{
					color: "#FFA800",
					size: 1
				}, // Clyde
				{
					color: "#FFA7DD",
					size: 1
				}, // Pinky
				{
					color: "yellow",
					size: 3
				}, // Chin area (yellow)
				{
					color: "yellow",
					size: 10
				} // Body area (yellow)
			]
		};
		this.charts.presets.BUTT = {
			rings: [
				{
					slices: [
						{
							color: "#FFCB99",
							size: 50
						}, // Right cheek
						{
							color: "black",
							size: 1
						}, // Crack
						{
							color: "#FFCB99",
							size: 50
						}, // Left cheek
					]
				}
			]
		};
		this.clear = () => {ctx.clearRect(0, 0, this.width, this.height);}
		this.getPixel = (x, y) => {
			let data = ctx.getImageData(x, y, 1, 1).data;
			return settings.colorMode === "rgb" ? data : rgbToHsl(data);
		}

		this.setPixels = (func, x, y, w, h) => {
			if(x === undefined) {
				x = 0;
				y = 0;
				w = this.width;
				h = this.height;
			}
			let imageData = ctx.getImageData(x, y, w, h);
			let data = imageData.data;
			let newData = new ImageData(w, h);
			wholeData = ctx.getImageData(0, 0, this.width, this.height).data;

			for(let i = 0; i < data.length; i += 4) {
				thisData = settings.colorMode === "rgb" ? [data[i], data[i + 1], data[i + 2], data[i + 3] / 255] : rgbToHsl(data[i], data[i + 1], data[i + 2], data[i + 3] / 255);
				let results = func((i / 4) % w, Math.floor((i / 4) / w), thisData[0], thisData[1], thisData[2], thisData[3], wholeData, i);
				if(settings.colorMode === "hsl") results = hslToRgb(results);
				newData.data[i] = results[0];
				newData.data[i + 1] = results[1];
				newData.data[i + 2] = results[2];
				newData.data[i + 3] = results[3] * 255;
			}

			if(x === 0 && y === 0 && w === this.width && h === this.height) {
				ctx.putImageData(newData, 0, 0);
			}
			else {
				bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
				bufferCtx.putImageData(newData, 0, 0);
				ctx.drawImage(bufferCanvas, 0, 0, w, h, x, y, w, h);
			}
		}
		this.download = name => {
			/*
			 *	Quick warning: This will NOT work on a "tainted" canvas (ie: one that used an image without CORS approval)
			 *	This is a security issue. It's annoying, but necessary.
			 *	(un)Fortunately, there is no work-around if the canvas has already been tainted.
			 *	For more info, visit: https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
			 */
			let link = document.createElement("a");
			link.href = canvas.toDataURL();
			link.download = name || "download";
			link.click();
			// window.open(canvas.toDataURL());
		}
		this.invert = percent => {
			percent = percent === undefined ? "100%" : percent + "%";
			applyCssFilter("invert", percent);
		}
		this.grayscale = percent => {
			percent = percent === undefined ? "100%" : percent + "%";
			applyCssFilter("grayscale", percent);
		}
		this.sepia = percent => {
			percent = percent === undefined ? "100%" : percent + "%";
			applyCssFilter("sepia", percent);
		}
		this.brightness = percent => {
			percent = percent === undefined ? "100%" : percent + "%";
			applyCssFilter("brightness", percent);
		}
		this.contrast = percent => {
			percent = percent === undefined ? "100%" : percent + "%";
			applyCssFilter("contrast", percent);
		}
		this.blur = px => {
			px = px === undefined ? "1px" : px + "px";
			applyCssFilter("blur", px);
		}
		this.saturate = percent => {
			percent = percent === undefined ? "100%" : percent + "%";
			applyCssFilter("saturate", percent);
		}
		this.opacity = percent => {
			percent = percent === undefined ? "100%" : percent + "%";
			applyCssFilter("opacity", percent);
		}
		this.colorshift = degrees => {
			degrees = degrees === undefined ? "180deg" : degrees + "deg";
			applyCssFilter("hue-rotate", degrees);
		}
		this.recolor = (arg1, arg2, arg3, arg4) => {
			ctx.save();
			ctx.globalCompositeOperation = "color";
			ctx.fillStyle = interpretColor(arg1, arg2, arg3, arg4, this.color);
			ctx.fillRect(0, 0, this.width, this.height);
			ctx.restore();
		}
		this.save = () => ctx.getImageData(0, 0, this.width, this.height);
		this.restore = imageData => {ctx.putImageData(imageData, 0, 0);}

		// Duplicates

		this.greyscale = ice.graphics.Scene.prototype.grayscale;
	}
})();
