if(typeof ice === "undefined") ice = {modules: []};
(function() {
	if(!ice.modules.includes("math")) ice.modules.push("math");
	ice.math = {};
	ice.math.version = "v2.0.12"; // This version of the ice.math module
	console.log("%cice.math " + ice.math.version + " imported successfully.", "color: #008000");

	/*
	 *	================ Math Module ================
	 */

	// Private variables/functions

	let RAD_TO_DEG = 180 / Math.PI;
	let DEG_TO_RAD = Math.PI / 180;
	let fibMem = {};

	// Properties

	ice.math.PI = Math.PI;
	ice.math.TAU = ice.math.PI * 2;
	ice.math.E = Math.E;

	// Methods

	ice.math.randomInt = function(min, max) { // returns a random int from min (inclusive) to max (inclusive)
		if(max === undefined) {
			if(min === undefined) {
				return Math.floor(Math.random() * 2);
			}
			let maxInt = Math.floor(min);
			return Math.floor(Math.random() * (maxInt + 1));
		}
		let minInt = Math.ceil(min);
		let maxInt = Math.floor(max);
		return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
	}
	ice.math.randomFloat = function(min, max) { // returns a random float from min (inclusive) to max (exclusive)
		if(max === undefined) {
			if(min === undefined) {
				return Math.random();
			}
			return Math.random() * min;
		}
		return Math.random() * (max - min) + min;
	}
	ice.math.randomFrom = function(input) { // returns a random element from an array
		if(typeof input === "string") input = input.split("");
		return input[Math.floor(Math.random() * input.length)];
	}
	ice.math.random = function(arg1, arg2) {
		if(typeof arg1 === "string") arg1 = arg1.split("");
		if(arg1 instanceof Array || arg1 instanceof Uint8ClampedArray) {
			return arg1[Math.floor(Math.random() * arg1.length)];
		}
		if(arg2 === undefined) {
			if(arg1 === undefined) {
				return Math.random();
			}
			return Math.random() * arg1;
		}
		return Math.random() * (arg2 - arg1) + arg1;
	}
	ice.math.randomGaussian = (function() {
		let haveExtra = false;
		let extra = null;
		return function(mean = 0, standardDeviation = 1) {
			if(haveExtra) {
				haveExtra = false;
				return extra * standardDeviation + mean;
			}
			let u, v, s;
			do {
				u = 2 * Math.random() - 1;
				v = 2 * Math.random() - 1;
				s = u * u + v * v;
			} while (s >= 1 || s === 0);
			let mul = Math.sqrt(-2 * Math.log(s) / s);
			extra = v * mul;
			haveExtra = true;
			return u * mul * standardDeviation + mean;
		}
	})();
	ice.math.chance = function(chance) { // returns true [chance] out of 1 times ([1] always returns true, [0.50] returns true 50% of the time, etc.)
		return Math.random() < chance;
	}
	ice.math.percentChance = function(chance) { // returns true [chance] percent of the time
		return Math.random() * 100 < chance;
	}
	ice.math.coinFlip = function() { // returns true 50% of the time
		return Math.random() < 0.50;
	}
	ice.math.dieRoll = function(sides = 6) { // returns true 50% of the time
		return Math.floor(Math.random() * sides) + 1;
	}
	ice.math.pythag = function(dX, dY) { // returns the length of the hypotenuse from the two other side lengths
		return Math.sqrt(dX * dX + dY * dY);
	}
	ice.math.distSq = function(x1, y1, x2, y2) {
		if(x2 === undefined) {
			let dx = x1.x - y1.x;
			let dy = x1.y - y1.y;
			return dx * dx + dy * dy;
		}
		let dx = x1 - x2;
		let dy = y1 - y2;
		return dx * dx + dy * dy;
	}
	ice.math.dist = function(x1, y1, x2, y2) {
		if(x2 === undefined) {
			let dx = x1.x - y1.x;
			let dy = x1.y - y1.y;
			return Math.sqrt(dx * dx + dy * dy);
		}
		let dx = x1 - x2;
		let dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	}
	ice.math.map = function(n, oldMin, oldMax, newMin, newMax, clamp) {
		/*
		 * A note to future me:
		 * STOP TRYING TO OPTIMIZE THIS!!!
		 * MAYBE it can be sped up, but how much?
		 * A few milliseconds? And don't you even
		 * think about a lookup table/Map constructor,
		 * you know better than that! Don't overcomplicate.
		 * Just let it go. Woo-sah, wooooo-saaaahh
		 */
		if(newMin === newMax) return newMin;
		let mapped = (n - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
		if(clamp) mapped = ice.math.clamp(mapped, newMin, newMax);
		return mapped;
	}
	ice.math.isPrime = function(n) { // returns whether or not a number is prime (negatives, 0, 1, non-integers, and Infinity are not prime)
		if(n <= 1 || n % 1 > 0 || !isFinite(n)) return false;
		if(n % 2 === 0) return n === 2;
		if(n % 3 === 0) return n === 3;
		for(let i = 5, sqrt = Math.sqrt(n); i <= sqrt; i += 6) {
			if(n % i === 0 || n % (i + 2) === 0) return false;
		}
		return true;
	}
	ice.math.factors = function(n) {
		let isEven = n % 2 === 0;
		let inc = isEven ? 1 : 2;
		let factors = [1, n];

		for(let curFactor = isEven ? 2 : 3, sqrtN = Math.sqrt(n); curFactor <= sqrtN; curFactor += inc) {
			if(n % curFactor !== 0) continue;
			factors.push(curFactor);
			let compliment = n / curFactor;
			if(compliment !== curFactor) factors.push(compliment);
		}

		return factors.sort((a, b) => a - b);
	}
	ice.math.radToDeg = function(rad) {
		return rad * RAD_TO_DEG;
	}
	ice.math.degToRad = function(deg) {
		return deg * DEG_TO_RAD;
	}
	ice.math.fibonacci = function(n) {
		n = n >= 1476 ? 1476 : Math.floor(n);
		if(n <= 1) return 1;
		if(fibMem[n] === undefined) return fibMem[n] = ice.math.fibonacci(n - 1) + ice.math.fibonacci(n - 2);
		return fibMem[n];
	}
	ice.math.clamp = function(n, min, max) {
		if(max === undefined) return n > min ? min : n;
		if(min > max) {
			let temp = min;
			min = max;
			max = temp;
		}
		if(n < min) return min;
		if(n > max) return max;
		return n;
	}
	ice.math.binary = function(n, pad = false) {
		return (pad ? Array(Math.clz32(n) + 1).join("0") : "") + (n >>> 0).toString(2);
	}
})();
