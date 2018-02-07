if(typeof ice === "undefined") ice = {
	modules: []
};
(function() {
	ice.modules.push("colors");
	ice.colors = {};
	ice.colors.version = "v2.1.7"; // This version of the ice.colors module
	console.log("%cice.colors " + ice.colors.version + " imported successfully.", "color: #008000");

	/*
	 *	================ Colors Module ================
	 */

	/*
	 *	TODO:
	 *		interpret
	 *		colerp
	 *		modify red, green, blue, alpha, hue, saturation, lightness, tint, tone, shade
	 *		invert, contrasting, blend
	 */

	// Private variables/functions

	function interpretColor(arg1, arg2, arg3, arg4) {
		if(arg1 === undefined) return [[0, 0, 0, 0], [0, 0, 0, 0], "#00000000"];
		if(arg2 === undefined) {
			if(typeof arg1 === "number") return [arg1, arg1, arg1, 1];
			if(
				arg1 instanceof Array ||
				arg1 instanceof Uint8ClampedArray
			) return interpretColor(arg1[0], arg1[1], arg1[2], arg1[3]);
			if(arg1.includes("rgb")) {
				let rgba = arg1.replace(/[^\d,.]/g, "").split(",").map(Number);
				if(rgba.length < 4) rgba.push(1);
				return [rgba, ice.colors.rgbToHsl(rgba), ice.colors.rgbToHex(rgba)];
			}
			if(arg1.includes("hsl")) {
				let hsla = arg1.replace(/[^\d,.]/g, "").split(",").map(Number);
				if(hsla.length < 4) hsla.push(1);
				let rgba = ice.colors.hslToRgb(hsla);
				return [rgba, hsla, ice.colors.rgbToHex(rgba)];
			}
			let rgba = ice.colors.hexToRgb(arg1);
			return [rgba, ice.colors.rgbToHsl(rgba), arg1]
		}
		let rgba = (
			arg3 === undefined ? [arg1, arg1, arg1, arg2] :
			arg4 === undefined ? [arg1, arg2, arg3, 1] :
			[arg1, arg2, arg3, arg4]
		);
		return [rgba, ice.colors.rgbToHsl(rgba), ice.colors.rgbToHex(rgba)];
	}
	ice.colors.Color = function(arg1, arg2, arg3, arg4) {
		[this.rgba, this.hsla, this.hex] = interpretColor(arg1, arg2, arg3, arg4);
	}

	// Properties

	// Hues
	ice.colors.RED = "#FF0000";
	ice.colors.ORANGE = "#FF8000";
	ice.colors.YELLOW = "#FFFF00";
	ice.colors.CHARTREUSE = "#80FF00";
	ice.colors.LIME = "#00FF00";
	ice.colors.MINT = "#00FF80";
	ice.colors.CYAN = "#00FFFF";
	ice.colors.CERULEAN = "#0080FF";
	ice.colors.BLUE = "#0000FF";
	ice.colors.PURPLE = "#8000FF";
	ice.colors.MAGENTA = "#FF00FF";
	ice.colors.PINK = "#FF0080";
	// Tints
	ice.colors.LIGHT_RED = ice.colors.SALMON = "#FF8080";
	ice.colors.LIGHT_ORANGE = ice.colors.PEACH = "#FFC080";
	ice.colors.LIGHT_YELLOW = ice.colors.CANARY = "#FFFF80";
	ice.colors.LIGHT_CHARTREUSE = ice.colors.KEYLIME = "#C0FF80";
	ice.colors.LIGHT_LIME = ice.colors.SHAMROCK = "#80FF80";
	ice.colors.LIGHT_MINT = ice.colors.SEAFOAM = "#80FFC0";
	ice.colors.LIGHT_CYAN = ice.colors.SKY = "#80FFFF";
	ice.colors.LIGHT_CERULEAN = ice.colors.CORNFLOWER = "#80C0FF";
	ice.colors.LIGHT_BLUE = ice.colors.PERIWINKLE = "#8080FF";
	ice.colors.LIGHT_PURPLE = ice.colors.LAVENDER = "#C080FF";
	ice.colors.LIGHT_MAGENTA = ice.colors.ORCHID = "#FF80FF";
	ice.colors.LIGHT_PINK = ice.colors.CARNATION = "#FF80C0";
	// Shades
	ice.colors.DARK_RED = ice.colors.MAROON = "#800000";
	ice.colors.DARK_ORANGE = ice.colors.RUST = "#804000";
	ice.colors.DARK_YELLOW = ice.colors.OLIVE = "#808000";
	ice.colors.DARK_CHARTREUSE = ice.colors.BASIL = "#408000";
	ice.colors.DARK_LIME = ice.colors.GREEN = "#008000";
	ice.colors.DARK_MINT = ice.colors.PINE = "#008040";
	ice.colors.DARK_CYAN = ice.colors.TEAL = "#008080";
	ice.colors.DARK_CERULEAN = ice.colors.COBALT = "#004080";
	ice.colors.DARK_BLUE = ice.colors.NAVY = "#000080";
	ice.colors.DARK_PURPLE = ice.colors.EGGPLANT = "#400080";
	ice.colors.DARK_MAGENTA = ice.colors.PLUM = "#800080";
	ice.colors.DARK_PINK = ice.colors.BEETROOT = "#800040";
	// Grayscale
	ice.colors.WHITE = "#FFFFFF";
	ice.colors.LIGHT_GRAY = ice.colors.SILVER = "#C0C0C0";
	ice.colors.GRAY = "#808080";
	ice.colors.DARK_GRAY = ice.colors.CHARCOAL = "#404040";
	ice.colors.BLACK = "#000000";
	// Misc colors
	ice.colors.BROWN = "#402000";
	ice.colors.GOLD = "#D0B030";
	ice.colors.SEPIA = "#704214";
	ice.colors.CLEAR = "rgba(0, 0, 0, 0)";
	// Duplicates
	ice.colors.AQUA = ice.colors.CYAN;
	ice.colors.VIOLET = ice.colors.PURPLE;
	ice.colors.FUCHSIA = ice.colors.MAGENTA;
	ice.colors.GREY = ice.colors.GRAY;
	ice.colors.LIGHT_AQUA = ice.colors.LIGHT_CYAN;
	ice.colors.LIGHT_VIOLET = ice.colors.LIGHT_PURPLE;
	ice.colors.LIGHT_FUCHSIA = ice.colors.LIGHT_MAGENTA;
	ice.colors.LIGHT_GREY = ice.colors.LIGHT_GRAY;
	ice.colors.DARK_AQUA = ice.colors.DARK_CYAN;
	ice.colors.DARK_VIOLET = ice.colors.DARK_PURPLE;
	ice.colors.DARK_FUCHSIA = ice.colors.DARK_MAGENTA;
	ice.colors.DARK_GREY = ice.colors.DARK_GRAY;
	ice.colors.TRANS = ice.colors.CLEAR;
	ice.colors.TRANSPARENT = ice.colors.CLEAR;

	ice.colors.hues = [
		ice.colors.RED,
		ice.colors.ORANGE,
		ice.colors.YELLOW,
		ice.colors.CHARTREUSE,
		ice.colors.LIME,
		ice.colors.MINT,
		ice.colors.CYAN,
		ice.colors.CERULEAN,
		ice.colors.BLUE,
		ice.colors.PURPLE,
		ice.colors.MAGENTA,
		ice.colors.PINK
	];
	ice.colors.tints = [
		ice.colors.SALMON,
		ice.colors.PEACH,
		ice.colors.CANARY,
		ice.colors.KEYLIME,
		ice.colors.SHAMROCK,
		ice.colors.SEAFOAM,
		ice.colors.SKY,
		ice.colors.CORNFLOWER,
		ice.colors.PERIWINKLE,
		ice.colors.LAVENDER,
		ice.colors.ORCHID,
		ice.colors.CARNATION
	];
	ice.colors.shades = [
		ice.colors.MAROON,
		ice.colors.RUST,
		ice.colors.OLIVE,
		ice.colors.BASIL,
		ice.colors.GREEN,
		ice.colors.PINE,
		ice.colors.TEAL,
		ice.colors.COBALT,
		ice.colors.NAVY,
		ice.colors.EGGPLANT,
		ice.colors.PLUM,
		ice.colors.BEETROOT
	];
	ice.colors.grayscale = [
		ice.colors.WHITE,
		ice.colors.SILVER,
		ice.colors.GRAY,
		ice.colors.CHARCOAL,
		ice.colors.BLACK
	];
	ice.colors.greyscale = ice.colors.grayscale;
	ice.colors.misc = [
		ice.colors.BROWN,
		ice.colors.GOLD,
		ice.colors.SEPIA,
		ice.colors.CLEAR
	];
	ice.colors.miscellaneous = ice.colors.misc;
	ice.colors.other = ice.colors.misc;
	ice.colors.huesExt = [].concat(ice.colors.hues, ice.colors.tints, ice.colors.shades);
	ice.colors.all = [].concat(ice.colors.huesExt, ice.colors.grayscale, ice.colors.misc);

	// Methods

	ice.colors.random = function(set) {
		set = set || ice.colors.huesExt;
		return set[Math.floor(Math.random() * set.length)];
	}

	ice.colors.rgbToHsl = function(r, g, b, a) {
		if(r === undefined) {
			return [0, 0, 0, 0];
		}
		else if(g === undefined) {
			if(typeof r === "string") {
				let rgbaArray = r.replace(/[^\d,.]/g, "").split(",").map(Number);
				return ice.colors.rgbToHsl(rgbaArray[0], rgbaArray[1], rgbaArray[2], rgbaArray[3]);
			}
			if(r instanceof Array || r instanceof Uint8ClampedArray) {
				return ice.colors.rgbToHsl(r[0], r[1], r[2], r[3]);
			}
			g = r;
			b = r;
			a = 1;
		}
		else if(b === undefined) {
			a = g;
			g = r;
			b = r;
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

	ice.colors.hslToRgb = function(h, s, l, a) {
		if(h === undefined) {
			return [0, 0, 0, 0];
		}
		else if(s === undefined) {
			if(typeof h === "string") {
				let hslaArray = h.replace(/[^\d,.]/g, "").split(",").map(Number);
				return ice.colors.hslToRgb(hslaArray[0], hslaArray[1], hslaArray[2], hslaArray[3]);
			}
			if(h instanceof Array || h instanceof Uint8ClampedArray) {
				return ice.colors.hslToRgb(h[0], h[1], h[2], h[3]);
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

	ice.colors.hexToRgb = function(hex) {
		hex = hex.toUpperCase().replace(/^#?([A-F\d])([A-F\d])([A-F\d])([A-F\d])?$/i, (m, r, g, b, a = "F") => r + r + g + g + b + b + a + a);
		let result = /^#?([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})?$/i.exec(hex);
		if(result === null) return [0, 0, 0, 0];
		result[4] = result[4] === undefined ? "FF" : result[4]
		return [
			parseInt(result[1], 16),
			parseInt(result[2], 16),
			parseInt(result[3], 16),
			parseInt(result[4], 16) / 255
		];
	}

	ice.colors.rgbToHex = function(r, g, b, a) {
		if(r === undefined) return "#00000000";
		else if(g === undefined) {
			if(typeof r === "string") {
				let rgbaArray = r.replace(/[^\d,.]/g, "").split(",").map(Number);
				return ice.colors.rgbToHex(rgbaArray[0], rgbaArray[1], rgbaArray[2], rgbaArray[3]);
			}
			if(r instanceof Array || r instanceof Uint8ClampedArray) return ice.colors.rgbToHex(r[0], r[1], r[2], r[3]);
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
		if(a !== undefined && a < 1) {
			a = parseInt(a * 255).toString(16);
			a = a.length === 1 ? "0" + a : a;
			rgb += a;
		}
		return rgb.toUpperCase();
	}

	ice.colors.hslToHex = function(h, s, l, a) {
		return ice.colors.rgbToHex(ice.colors.hslToRgb(h, s, l, a));
	}

	ice.colors.hexToHsl = function(hex) {
		return ice.colors.rgbToHsl(ice.colors.hexToRgb(hex));
	}
})();
