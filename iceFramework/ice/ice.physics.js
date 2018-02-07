if(typeof ice === "undefined") ice = {modules: []};
(function() {
	if(!ice.modules.includes("physics")) ice.modules.push("physics");
	ice.physics = {};
	ice.physics.version = "v2.2.2"; // This version of the ice.physics module
	console.log("%cice.physics " + ice.physics.version + " imported successfully.", "color: #008000");

	/*
	 *	================ Physics Module ================
	 */

	// Private variables/functions

	let TAU = Math.PI * 2;
	let radToDeg = 180 / Math.PI;
	let degToRad = Math.PI / 180;
	function distSq(v1, v2) {
		let dx = v1.x - v2.x;
		let dy = v1.y - v2.y;
		return dx * dx + dy * dy;
	}
	function distSqXYXY(x1, y1, x2, y2) {
		let dx = x1 - x2;
		let dy = y1 - y2;
		return dx * dx + dy * dy;
	}
	function clamp(val, min, max) {
		return Math.max(min, Math.min(max, val));
	}
	function lineHelper(l1Pos1, l1Pos2, l2Pos1) {
		return (l1Pos2.x - l1Pos1.x) * (l2Pos1.y - l1Pos1.y) - (l2Pos1.x - l1Pos1.x) * (l1Pos2.y - l1Pos1.y);
	}
	function closestPointOnSegment(pPos, lPos1, lPos2) {
		let lineDistSq = distSq(lPos1, lPos2);
		// If the two points are the same...
		if(lineDistSq === 0) {
			// Return the distanceSq between the "line" and the point.
			return distSq(pPos, lPos1);
		}
		let closestPointLocation = (
			(pPos.x - lPos1.x) * (lPos2.x - lPos1.x) +
			(pPos.y - lPos1.y) * (lPos2.y - lPos1.y)
		) / lineDistSq;
		closestPointLocation = clamp(closestPointLocation, 0, 1);
		return new ice.physics.Vector(
			lPos1.x + closestPointLocation * (lPos2.x - lPos1.x),
			lPos1.y + closestPointLocation * (lPos2.y - lPos1.y)
		);
	}
	function distToSegmentSq(pPos, lPos1, lPos2) {
		return distSq(pPos, closestPointOnSegment(pPos, lPos1, lPos2));
	}

	// Constructors

	ice.physics.Vector = function(x, y) {
		if(!(this instanceof ice.physics.Vector)) {
			return new ice.physics.Vector(x, y);
		}

		this.x = x || 0;
		this.y = y || 0;
	}

	// Returns a clone of the vector
	ice.physics.Vector.prototype.clone = function() {
		return new ice.physics.Vector(this.x, this.y);
	}

	// Returns the magnitude of the vector
	ice.physics.Vector.prototype.magnitude = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	// Faster than .magnitude() (For comparison)
	ice.physics.Vector.prototype.magnitudeSq = function() {
		return this.x * this.x + this.y * this.y;
	}

	// Returns the dot product of the vector and another
	ice.physics.Vector.prototype.dot = function(vec) {
		return this.x * vec.x + this.y * vec.y;
	}

	// Returns the cross product of the vector and another
	ice.physics.Vector.prototype.cross = function(vec) {
		return (this.x * vec.y) - (this.y * vec.x);
	}

	// Returns the angle of the vector from another (In radians)
	ice.physics.Vector.prototype.radians = function(vec) {
		if(vec === undefined) {
			return Math.atan2(this.y, this.x);
		}
		return Math.atan2(this.y, this.x) - Math.atan2(vec.y, vec.x);
	}

	// Returns the angle of the vector from another (In degrees)
	ice.physics.Vector.prototype.degrees = function(vec) {
		return this.radians(vec) * radToDeg;
	}

	// Returns the angle of the vector from another (In non-negative radians)
	ice.physics.Vector.prototype.radiansCCW = function(vec) {
		return (TAU + this.radians(vec)) % TAU;
	}

	// Returns the angle of the vector from another (In non-negative degrees)
	ice.physics.Vector.prototype.degreesCCW = function(vec) {
		return (360 + this.degrees(vec)) % 360;
	}

	// Returns the euclidian distance between the vector and another
	ice.physics.Vector.prototype.distance = function(vec) {
		vec = vec || ice.physics.origin();
		let dx = this.x - vec.x;
		let dy = this.y - vec.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
	ice.physics.Vector.prototype.distanceX = function(vec) {
		vec = vec || ice.physics.origin();
		return Math.abs(this.x - vec.x);
	}
	ice.physics.Vector.prototype.distanceY = function(vec) {
		vec = vec || ice.physics.origin();
		return Math.abs(this.y - vec.y);
	}

	// Faster than .distance() (for comparison)
	ice.physics.Vector.prototype.distanceSq = function(vec) {
		vec = vec || ice.physics.origin();
		let dx = this.x - vec.x;
		let dy = this.y - vec.y;
		return dx * dx + dy * dy;
	}

	// Returns the manhattan distance between the vector and another
	ice.physics.Vector.prototype.manhattanDistance = function(vec) {
		vec = vec || ice.physics.origin();
		return Math.abs(this.x - vec.x) + Math.abs(this.y - vec.y);
	}

	// Returns whether or not two vectors are equal (same x and y)
	ice.physics.Vector.prototype.equals = function(vec) {
		return this.x === vec.x && this.y === vec.y;
	}

	// Returns the vector as a string (Mostly for debugging)
	ice.physics.Vector.prototype.toString = function() {
		return "[object ice.physics.Vector] {x: " + this.x + ", y: " + this.y + "}";
	}

	// Returns the vector as an object (Mostly for debugging)
	ice.physics.Vector.prototype.toObject = function() {
		return {x: this.x, y: this.y};
	}

	// Returns the vector as an array (Mostly for debugging)
	ice.physics.Vector.prototype.toArray = function() {
		return [this.x, this.y];
	}

	// Normalizes the vector (The magnitude is set to 1, but the angle is unchanged)
	ice.physics.Vector.prototype.normalize = function() {
		return this.divide(this.magnitude() || 1);
	}

	// Sets the magnitude (The angle remains unchanged)
	ice.physics.Vector.prototype.setMagnitude = function(mag) {
		return this.normalize().multiply(mag);
	}

	// Moves the vector towards another (By absolute distance)
	ice.physics.Vector.prototype.towards = function(vec, dist) {
		return this.add(vec.clone().subtract(this).normalize().multiply(dist === undefined ? 1 : dist));
	}

	// Moves the vector towards another (By relative distance)
	ice.physics.Vector.prototype.linearInterpolate = function(vec, frac) {
		this.x += (vec.x - this.x) * frac;
		this.y += (vec.y - this.y) * frac;
		return this;
	}

	// Rotates the vector around another by a certain angle (In radians)
	ice.physics.Vector.prototype.rotate = function(angle, center) {
		center = center || ice.physics.origin();

		let cos = Math.cos(angle);
		let sin = Math.sin(angle);
		let x = this.x - center.x;
		let y = this.y - center.y;

		this.x = x * cos - y * sin + center.x;
		this.y = x * sin + y * cos + center.y;
		return this;
	}

	// Rotates the vector around another by a certain angle (In degrees)
	ice.physics.Vector.prototype.rotateDegrees = function(angle, center) {
		return this.rotate(angle * degToRad, center);
	}

	// Sets the vectors angle (In radians)
	ice.physics.Vector.prototype.setAngle = function(angle, center) {
		center = center || ice.physics.origin();

		let mag = this.distance(center);

		this.x = Math.cos(angle) * mag + center.x;
		this.y = Math.sin(angle) * mag + center.y;
		return this;
	}

	// Sets the vectors angle (In degrees)
	ice.physics.Vector.prototype.setDegrees = function(angle, center) {
		return this.setAngle(angle * degToRad, center);
	}

	// Inverts the vector (x and y *= -1)
	ice.physics.Vector.prototype.invert = function(center) {
		if(center === undefined) {
			this.x *= -1;
			this.y *= -1;
			return this;
		}
		this.x = ((this.x - center.x) * -1) + center.x;
		this.y = ((this.y - center.y) * -1) + center.y;
		return this;
	}
	ice.physics.Vector.prototype.invertX = function(center) {
		if(center === undefined) {
			this.x *= -1;
			return this;
		}
		this.x = ((this.x - center.x) * -1) + center.x;
		return this;
	}
	ice.physics.Vector.prototype.invertY = function(center) {
		if(center === undefined) {
			this.y *= -1;
			return this;
		}
		this.y = ((this.y - center.y) * -1) + center.y;
		return this;
	}

	// Rounds the vector's x and y to the nearest integer
	ice.physics.Vector.prototype.round = function() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	}
	ice.physics.Vector.prototype.roundX = function() {
		this.x = Math.round(this.x);
		return this;
	}
	ice.physics.Vector.prototype.roundY = function() {
		this.y = Math.round(this.y);
		return this;
	}

	// Floors the vector's x and y
	ice.physics.Vector.prototype.floor = function() {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	}
	ice.physics.Vector.prototype.floorX = function() {
		this.x = Math.floor(this.x);
		return this;
	}
	ice.physics.Vector.prototype.floorY = function() {
		this.y = Math.floor(this.y);
		return this;
	}

	// Ceils the vector's x and y
	ice.physics.Vector.prototype.ceil = function() {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	}
	ice.physics.Vector.prototype.ceilX = function() {
		this.x = Math.ceil(this.x);
		return this;
	}
	ice.physics.Vector.prototype.ceilY = function() {
		this.y = Math.ceil(this.y);
		return this;
	}

	// Clamps the vector's x and y
	ice.physics.Vector.prototype.clamp = function(topLeft, bottomRight) {
		this.x = clamp(this.x, topLeft.x, bottomRight.x);
		this.y = clamp(this.y, topLeft.y, bottomRight.y);
		return this;
	}
	ice.physics.Vector.prototype.clampX = function(min, max) {
		if(min > max) {
			let temp = max;
			max = min;
			min = temp;
		}
		this.x = clamp(this.x, min, max);
		return this;
	}
	ice.physics.Vector.prototype.clampY = function(min, max) {
		if(min > max) {
				let temp = max;
				max = min;
				min = temp;
		}
		this.y = clamp(this.y, min, max);
		return this;
	}
	ice.physics.Vector.prototype.clampXY = function(minX, maxX, minY, maxY) {
		if(minX > maxX) {
				let temp = maxX;
				maxX = minX;
				minX = temp;
		}
		if(maxX === undefined) {
			this.x = clamp(this.x, minX, minY);
			this.y = clamp(this.y, minX, minY);
			return this;
		}
		if(minY > maxY) {
			let temp = maxY;
			maxY = minY;
			minY = temp;
		}
		this.x = clamp(this.x, minX, maxX);
		this.y = clamp(this.y, minY, maxY);
		return this;
	}

	// Clamps the vector's magnitude
	ice.physics.Vector.prototype.clampMagnitude = function(min, max) {
		if(max === undefined) {
			max = min;
			min = 0;
		}
		else if(max < min) {
			let temp = max;
			max = min;
			min = temp;
		}
		let magSq = this.magnitudeSq();
		if(magSq < min * min) {
			return this.setMagnitude(min);
		}
		if(magSq > max * max) {
			return this.setMagnitude(max);
		}
		return this;
	}

	// Randomizes the vector's x and y
	ice.physics.Vector.prototype.randomize = function(topLeft, bottomRight) {
		if(bottomRight === undefined) {
			return this.randomizeAngle();
		}
		this.x = Math.random() * (bottomRight.x - topLeft.x) + topLeft.x;
		this.y = Math.random() * (topLeft.y - bottomRight.y) + bottomRight.y;
		return this;
	}
	ice.physics.Vector.prototype.randomizeX = function(min, max) {
		if(max < min) {
			let temp = max;
			max = min;
			min = temp;
		}
		this.x = Math.random() * (max - min) + min;
		return this;
	}
	ice.physics.Vector.prototype.randomizeY = function(min, max) {
		if(max < min) {
			let temp = max;
			max = min;
			min = temp;
		}
		this.y = Math.random() * (max - min) + min;
		return this;
	}
	ice.physics.Vector.prototype.randomizeXY = function(min, max) {
		if(max < min) {
			let temp = max;
			max = min;
			min = temp;
		}
		this.x = Math.random() * (max - min) + min;
		this.y = Math.random() * (max - min) + min;
		return this;
	}
	ice.physics.Vector.prototype.randomizeXorY = function(min, max) {
		if(Math.random() < 0.50) {
			return this.randomizeX(min, max);
		}
		else {
			return this.randomizeY(min, max);
		}
	}
	ice.physics.Vector.prototype.randomizeAngle = function(min, max) {
		if(max === undefined) {
			if(min === undefined) {
				return this.setAngle(Math.random() * TAU);
			}
			return this.setAngle(Math.random() * min);
		}
		return this.setAngle(Math.random() * (max - min) + min);
	}
	ice.physics.Vector.prototype.randomizeDegrees = function(min, max) {
		if(max === undefined) {
			if(min === undefined) {
				return this.setDegrees(Math.random() * 360);
			}
			return this.setDegrees(Math.random() * min);
		}
		return this.setDegrees(Math.random() * (max - min) + min);
	}
	ice.physics.Vector.prototype.randomizeMagnitude = function(min, max) {
		if(max === undefined) {
			if(min === undefined) {
				return this.setMagnitude(Math.random());
			}
			return this.setMagnitude(Math.random() * min);
		}
		return this.setMagnitude(Math.random() * (max - min) + min);
	}

	// Sets the vectors x and y
	ice.physics.Vector.prototype.set = function(vec) {
		this.x = vec.x === undefined ? vec : vec.x;
		this.y = vec.y === undefined ? vec : vec.y;
		return this;
	}
	ice.physics.Vector.prototype.setX = function(vec) {
		this.x = vec.x === undefined ? vec : vec.x;
		return this;
	}
	ice.physics.Vector.prototype.setY = function(vec) {
		this.y = vec.y === undefined ? vec : vec.y;
		return this;
	}
	ice.physics.Vector.prototype.setXY = function(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	// Adds to the vectors x and y
	ice.physics.Vector.prototype.add = function(vec) {
		this.x += vec.x === undefined ? vec : vec.x;
		this.y += vec.y === undefined ? vec : vec.y;
		return this;
	}
	ice.physics.Vector.prototype.addX = function(vec) {
		this.x += vec.x === undefined ? vec : vec.x;
		return this;
	}
	ice.physics.Vector.prototype.addY = function(vec) {
		this.y += vec.y === undefined ? vec : vec.y;
		return this;
	}
	ice.physics.Vector.prototype.addXY = function(x, y) {
		this.x += x;
		this.y += y;
		return this;
	}

	// Subtracts from the vectors x and y
	ice.physics.Vector.prototype.subtract = function(vec) {
		this.x -= vec.x === undefined ? vec : vec.x;
		this.y -= vec.y === undefined ? vec : vec.y;
		return this;
	}
	ice.physics.Vector.prototype.subtractX = function(vec) {
		this.x -= vec.x === undefined ? vec : vec.x;
		return this;
	}
	ice.physics.Vector.prototype.subtractY = function(vec) {
		this.y -= vec.y === undefined ? vec : vec.y;
		return this;
	}
	ice.physics.Vector.prototype.subtractXY = function(x, y) {
		this.x -= x;
		this.y -= y;
		return this;
	}

	// Multiplies the vectors x and y
	ice.physics.Vector.prototype.multiply = function(vec) {
		this.x *= vec.x === undefined ? vec : vec.x;
		this.y *= vec.y === undefined ? vec : vec.y;
		return this;
	}
	ice.physics.Vector.prototype.multiplyX = function(vec) {
		this.x *= vec.x === undefined ? vec : vec.x;
		return this;
	}
	ice.physics.Vector.prototype.multiplyY = function(vec) {
		this.y *= vec.y === undefined ? vec : vec.y;
		return this;
	}
	ice.physics.Vector.prototype.multiplyXY = function(x, y) {
		this.x *= x;
		this.y *= y;
		return this;
	}

	// Divides the vectors x and y
	ice.physics.Vector.prototype.divide = function(vec) {
		this.x /= vec.x === undefined ? vec : vec.x;
		this.y /= vec.y === undefined ? vec : vec.y;
		return this;
	}
	ice.physics.Vector.prototype.divideX = function(vec) {
		this.x /= vec.x === undefined ? vec : vec.x;
		return this;
	}
	ice.physics.Vector.prototype.divideY = function(vec) {
		this.y /= vec.y === undefined ? vec :vec.y;
		return this;
	}
	ice.physics.Vector.prototype.divideXY = function(x, y) {
		this.x /= x;
		this.y /= y;
		return this;
	}

	// Mods the vectors x and y
	ice.physics.Vector.prototype.mod = function(vec) {
		this.x %= vec.x === undefined ? vec : vec.x;
		this.y %= vec.y === undefined ? vec : vec.y;
		return this;
	}
	ice.physics.Vector.prototype.modX = function(vec) {
		this.x %= vec.x === undefined ? vec : vec.x;
		return this;
	}
	ice.physics.Vector.prototype.modY = function(vec) {
		this.y %= vec.y === undefined ? vec : vec.y;
		return this;
	}
	ice.physics.Vector.prototype.modXY = function(x, y) {
		this.x %= x;
		this.y %= y;
		return this;
	}

	// Synonyms

	ice.physics.Vector.prototype.copy = ice.physics.Vector.prototype.clone;
	ice.physics.Vector.prototype.mag = ice.physics.Vector.prototype.magnitude;
	ice.physics.Vector.prototype.magSq = ice.physics.Vector.prototype.magnitudeSq;
	ice.physics.Vector.prototype.angle = ice.physics.Vector.prototype.radians;
	ice.physics.Vector.prototype.rad = ice.physics.Vector.prototype.radians;
	ice.physics.Vector.prototype.deg = ice.physics.Vector.prototype.degrees;
	ice.physics.Vector.prototype.radCCW = ice.physics.Vector.prototype.radiansCCW;
	ice.physics.Vector.prototype.degCCW = ice.physics.Vector.prototype.degreesCCW;
	ice.physics.Vector.prototype.dist = ice.physics.Vector.prototype.distance;
	ice.physics.Vector.prototype.distX = ice.physics.Vector.prototype.distanceX;
	ice.physics.Vector.prototype.distY = ice.physics.Vector.prototype.distanceY;
	ice.physics.Vector.prototype.distSq = ice.physics.Vector.prototype.distanceSq;
	ice.physics.Vector.prototype.manDist = ice.physics.Vector.prototype.manhattanDistance;
	ice.physics.Vector.prototype.manhattan = ice.physics.Vector.prototype.manhattanDistance;
	ice.physics.Vector.prototype.manhattanDist = ice.physics.Vector.prototype.manhattanDistance;
	ice.physics.Vector.prototype.norm = ice.physics.Vector.prototype.normalize;
	ice.physics.Vector.prototype.setMag = ice.physics.Vector.prototype.setMagnitude;
	ice.physics.Vector.prototype.setLength = ice.physics.Vector.prototype.setMagnitude;
	ice.physics.Vector.prototype.lerp = ice.physics.Vector.prototype.linearInterpolate;
	ice.physics.Vector.prototype.rotateRadians = ice.physics.Vector.prototype.rotate;
	ice.physics.Vector.prototype.rotateRad = ice.physics.Vector.prototype.rotate;
	ice.physics.Vector.prototype.rotateDeg = ice.physics.Vector.prototype.rotateDegrees;
	ice.physics.Vector.prototype.setRadians = ice.physics.Vector.prototype.setAngle;
	ice.physics.Vector.prototype.setRad = ice.physics.Vector.prototype.setAngle;
	ice.physics.Vector.prototype.setDeg = ice.physics.Vector.prototype.setDegrees;
	ice.physics.Vector.prototype.clampMag = ice.physics.Vector.prototype.clampMagnitude;
	ice.physics.Vector.prototype.clampLength = ice.physics.Vector.prototype.clampMagnitude;
	ice.physics.Vector.prototype.random = ice.physics.Vector.prototype.randomize;
	ice.physics.Vector.prototype.randomX = ice.physics.Vector.prototype.randomizeX;
	ice.physics.Vector.prototype.randomY = ice.physics.Vector.prototype.randomizeY;
	ice.physics.Vector.prototype.randomXY = ice.physics.Vector.prototype.randomizeXY;
	ice.physics.Vector.prototype.randomAngle = ice.physics.Vector.prototype.randomizeAngle;
	ice.physics.Vector.prototype.randomizeRadians = ice.physics.Vector.prototype.randomizeAngle;
	ice.physics.Vector.prototype.randomRandians = ice.physics.Vector.prototype.randomizeAngle;
	ice.physics.Vector.prototype.randomizeRad = ice.physics.Vector.prototype.randomizeAngle;
	ice.physics.Vector.prototype.randomRad = ice.physics.Vector.prototype.randomizeAngle;
	ice.physics.Vector.prototype.randomDegrees = ice.physics.Vector.prototype.randomizeDegrees;
	ice.physics.Vector.prototype.randomizeDeg = ice.physics.Vector.prototype.randomizeDegrees;
	ice.physics.Vector.prototype.randomDeg = ice.physics.Vector.prototype.randomizeDegrees;
	ice.physics.Vector.prototype.randomMagnitude = ice.physics.Vector.prototype.randomizeMagnitude;
	ice.physics.Vector.prototype.randomizeMag = ice.physics.Vector.prototype.randomizeMagnitude;
	ice.physics.Vector.prototype.randomMag = ice.physics.Vector.prototype.randomizeMagnitude;
	ice.physics.Vector.prototype.randomizeLength = ice.physics.Vector.prototype.randomizeMagnitude;
	ice.physics.Vector.prototype.randomLength = ice.physics.Vector.prototype.randomizeMagnitude;
	ice.physics.Vector.prototype.randomAny = ice.physics.Vector.prototype.randomizeAny;
	ice.physics.Vector.prototype.rand = ice.physics.Vector.prototype.randomize;
	ice.physics.Vector.prototype.randX = ice.physics.Vector.prototype.randomizeX;
	ice.physics.Vector.prototype.randY = ice.physics.Vector.prototype.randomizeY;
	ice.physics.Vector.prototype.randXY = ice.physics.Vector.prototype.randomizeXY;
	ice.physics.Vector.prototype.randAngle = ice.physics.Vector.prototype.randomizeAngle;
	ice.physics.Vector.prototype.randRandians = ice.physics.Vector.prototype.randomizeAngle;
	ice.physics.Vector.prototype.randRad = ice.physics.Vector.prototype.randomizeAngle;
	ice.physics.Vector.prototype.randDegrees = ice.physics.Vector.prototype.randomizeDegrees;
	ice.physics.Vector.prototype.randDeg = ice.physics.Vector.prototype.randomizeDegrees;
	ice.physics.Vector.prototype.randMagnitude = ice.physics.Vector.prototype.randomizeMagnitude;
	ice.physics.Vector.prototype.randMag = ice.physics.Vector.prototype.randomizeMagnitude;
	ice.physics.Vector.prototype.randLength = ice.physics.Vector.prototype.randomizeMagnitude;
	ice.physics.Vector.prototype.randAny = ice.physics.Vector.prototype.randomizeAny;
	ice.physics.Vector.prototype.sub = ice.physics.Vector.prototype.subtract;
	ice.physics.Vector.prototype.subX = ice.physics.Vector.prototype.subtractX;
	ice.physics.Vector.prototype.subY = ice.physics.Vector.prototype.subtractY;
	ice.physics.Vector.prototype.subXY = ice.physics.Vector.prototype.subtractXY;
	ice.physics.Vector.prototype.mult = ice.physics.Vector.prototype.multiply;
	ice.physics.Vector.prototype.multX = ice.physics.Vector.prototype.multiplyX;
	ice.physics.Vector.prototype.multY = ice.physics.Vector.prototype.multiplyY;
	ice.physics.Vector.prototype.multXY = ice.physics.Vector.prototype.multiplyXY;
	ice.physics.Vector.prototype.div = ice.physics.Vector.prototype.divide;
	ice.physics.Vector.prototype.divX = ice.physics.Vector.prototype.divideX;
	ice.physics.Vector.prototype.divY = ice.physics.Vector.prototype.divideY;
	ice.physics.Vector.prototype.divXY = ice.physics.Vector.prototype.divideXY;
	ice.physics.Vector.prototype.scale = ice.physics.Vector.prototype.divide;
	ice.physics.Vector.prototype.scaleX = ice.physics.Vector.prototype.divideX;
	ice.physics.Vector.prototype.scaleY = ice.physics.Vector.prototype.divideY;
	ice.physics.Vector.prototype.scaleXY = ice.physics.Vector.prototype.divideXY;

	// Methods

	ice.physics.origin = function() {
		return new ice.physics.Vector(0, 0);
	}
	ice.physics.unit = function() {
		return new ice.physics.Vector(1, 0);
	}
	ice.physics.random = function() {
		let angle = Math.random() * TAU;
		return new ice.physics.Vector(Math.cos(angle), Math.sin(angle));
	}
	ice.physics.pointInPoint = function(p1Pos, p2Pos) {
		return p1Pos.x === p2Pos.x && p1Pos.y === p2Pos.y;
	}
	ice.physics.pointOnPoint = function(p1Pos, p2Pos) {
		return p1Pos.x === p2Pos.x && p1Pos.y === p2Pos.y;
	}
	ice.physics.pointInCircle = function(pPos, cPos, cRad) {
		return distSq(pPos, cPos) < cRad * cRad;
	}
	ice.physics.pointOnCircle = function(pPos, cPos, cRad) {
		return distSq(pPos, cPos) <= cRad * cRad;
	}
	ice.physics.pointInRect = function(pPos, rPos, rWid, rHgt) {
		return (
			pPos.x > rPos.x &&
			pPos.y > rPos.y &&
			pPos.x < rPos.x + rWid &&
			pPos.y < rPos.y + rHgt
		);
	}
	ice.physics.pointOnRect = function(pPos, rPos, rWid, rHgt) {
		return (
			pPos.x >= rPos.x &&
			pPos.y >= rPos.y &&
			pPos.x <= rPos.x + rWid &&
			pPos.y <= rPos.y + rHgt
		);
	}
	ice.physics.pointInLine = function(pPos, lPos1, lPos2) {
		let closestPoint = closestPointOnSegment(lPos1, lPos2, pPos);
		return closestPoint.x === pPos.x && closestPoint.y === pPos.y;
	}
	ice.physics.pointOnLine = function(pPos, lPos1, lPos2) {
		let closestPoint = closestPointOnSegment(lPos1, lPos2, pPos);
		return closestPoint.x === pPos.x && closestPoint.y === pPos.y;
	}
	ice.physics.circleInPoint = function(cPos, cRad, pPos) {
		return distSq(pPos, cPos) < cRad * cRad;
	}
	ice.physics.circleOnPoint = function(cPos, cRad, pPos) {
		return distSq(pPos, cPos) <= cRad * cRad;
	}
	ice.physics.circleInCircle = function(c1Pos, c1Rad, c2Pos, c2Rad) {
		let radii = c1Rad + c2Rad;
		return distSq(c1Pos, c2Pos) < radii * radii;
	}
	ice.physics.circleOnCircle = function(c1Pos, c1Rad, c2Pos, c2Rad) {
		let radii = c1Rad + c2Rad;
		return distSq(c1Pos, c2Pos) <= radii * radii;
	}
	ice.physics.circleInRect = function(cPos, cRad, rPos, rWid, rHgt) {
		let closestX = clamp(cPos.x, rPos.x, rPos.x + rWid);
		let closestY = clamp(cPos.y, rPos.y, rPos.y + rHgt);
		return distSqXYXY(cPos.x, cPos.y, closestX, closestY) < cRad * cRad;
	}
	ice.physics.circleOnRect = function(cPos, cRad, rPos, rWid, rHgt) {
		let closestX = clamp(cPos.x, rPos.x, rPos.x + rWid);
		let closestY = clamp(cPos.y, rPos.y, rPos.y + rHgt);
		return distSqXYXY(cPos.x, cPos.y, closestX, closestY) <= cRad * cRad;
	}
	ice.physics.circleInLine = function(cPos, cRad, lPos1, lPos2) {
		return distToSegmentSq(cPos, lPos1, lPos2) < cRad * cRad;
	}
	ice.physics.circleOnLine = function(cPos, cRad, lPos1, lPos2) {
		return distToSegmentSq(cPos, lPos1, lPos2) <= cRad * cRad;
	}
	ice.physics.rectInPoint = function(rPos, rWid, rHgt, pPos) {
			return (
				pPos.x > rPos.x &&
				pPos.y > rPos.y &&
				pPos.x < rPos.x + rWid &&
				pPos.y < rPos.y + rHgt
			);
	}
	ice.physics.rectOnPoint = function(rPos, rWid, rHgt, pPos) {
			return (
				pPos.x >= rPos.x &&
				pPos.y >= rPos.y &&
				pPos.x <= rPos.x + rWid &&
				pPos.y <= rPos.y + rHgt
			);
	}
	ice.physics.rectInCircle = function(rPos, rWid, rHgt, cPos, cRad) {
		let closestX = clamp(cPos.x, rPos.x, rPos.x + rWid);
		let closestY = clamp(cPos.y, rPos.y, rPos.y + rHgt);
		return distSqXYXY(cPos.x, cPos.y, closestX, closestY) < cRad * cRad;
	}
	ice.physics.rectOnCircle = function(rPos, rWid, rHgt, cPos, cRad) {
		let closestX = clamp(cPos.x, rPos.x, rPos.x + rWid);
		let closestY = clamp(cPos.y, rPos.y, rPos.y + rHgt);
		return distSqXYXY(cPos.x, cPos.y, closestX, closestY) <= cRad * cRad;
	}
	ice.physics.rectInRect = function(r1Pos, r1Wid, r1Hgt, r2Pos, r2Wid, r2Hgt) {
		return (
			r1Pos.x < r2Pos.x + r2Wid &&
			r2Pos.x < r1Pos.x + r1Wid &&
			r1Pos.y < r2Pos.y + r2Hgt &&
			r2Pos.y < r1Pos.y + r1Hgt
		);
	}
	ice.physics.rectOnRect = function(r1Pos, r1Wid, r1Hgt, r2Pos, r2Wid, r2Hgt) {
		return (
			r1Pos.x <= r2Pos.x + r2Wid &&
			r2Pos.x <= r1Pos.x + r1Wid &&
			r1Pos.y <= r2Pos.y + r2Hgt &&
			r2Pos.y <= r1Pos.y + r1Hgt
		);
	}
	ice.physics.rectInLine = function(rPos, rWid, rHgt, lPos1, lPos2) {
		let bottomRight = {x: rPos.x + rWid, y: rPos.y + rHgt};
		if(
			(
				lPos1.x > rPos.x &&
				lPos1.y > rPos.y &&
				lPos1.x < bottomRight.x &&
				lPos1.y < bottomRight.y
			) || (
				lPos2.x > rPos.x &&
				lPos2.y > rPos.y &&
				lPos2.x < bottomRight.x &&
				lPos2.y < bottomRight.y
			)
		) {
			return true;
		}
		let topRight = {x: rPos.x + rWid, y: rPos.y};
		let bottomLeft = {x: rPos.x, y: rPos.y + rHgt};
		return (
			ice.physics.lineInLine(lPos1, lPos2, rPos, topRight) ||
			ice.physics.lineInLine(lPos1, lPos2, rPos, bottomLeft) ||
			ice.physics.lineInLine(lPos1, lPos2, bottomRight, topRight) ||
			ice.physics.lineInLine(lPos1, lPos2, bottomRight, bottomLeft)
		);
	}
	ice.physics.rectOnLine = function(rPos, rWid, rHgt, lPos1, lPos2) {
		let bottomRight = {x: rPos.x + rWid, y: rPos.y + rHgt};
		if(
			lPos1.x >= rPos.x &&
			lPos1.y >= rPos.y &&
			lPos2.x >= rPos.x &&
			lPos2.y >= rPos.y &&
			lPos1.x <= bottomRight.x &&
			lPos1.y <= bottomRight.y &&
			lPos2.x <= bottomRight.x &&
			lPos2.y <= bottomRight.y
		) {
			return true;
		}
		let topRight = {x: rPos.x + rWid, y: rPos.y};
		let bottomLeft = {x: rPos.x, y: rPos.y + rHgt};
		return (
			ice.physics.lineOnLine(lPos1, lPos2, rPos, topRight) ||
			ice.physics.lineOnLine(lPos1, lPos2, rPos, bottomLeft) ||
			ice.physics.lineOnLine(lPos1, lPos2, bottomRight, topRight) ||
			ice.physics.lineOnLine(lPos1, lPos2, bottomRight, bottomLeft)
		);
	}
	ice.physics.lineInPoint = function(lPos1, lPos2, pPos) {
		let closestPoint = closestPointOnSegment(lPos1, lPos2, pPos);
		return closestPoint.x === pPos.x && closestPoint.y === pPos.y;
	}
	ice.physics.lineOnPoint = function(lPos1, lPos2, pPos) {
		let closestPoint = closestPointOnSegment(lPos1, lPos2, pPos);
		return closestPoint.x === pPos.x && closestPoint.y === pPos.y;
	}
	ice.physics.lineInCircle = function(lPos1, lPos2, cPos, cRad) {
		return distToSegmentSq(cPos, lPos1, lPos2) < cRad * cRad;
	}
	ice.physics.lineOnCircle = function(lPos1, lPos2, cPos, cRad) {
		return distToSegmentSq(cPos, lPos1, lPos2) <= cRad * cRad;
	}
	ice.physics.lineInRect = function(lPos1, lPos2, rPos, rWid, rHgt) {
		let bottomRight = {x: rPos.x + rWid, y: rPos.y + rHgt};
		if(
			(
				lPos1.x > rPos.x &&
				lPos1.y > rPos.y &&
				lPos1.x < bottomRight.x &&
				lPos1.y < bottomRight.y
			) || (
				lPos2.x > rPos.x &&
				lPos2.y > rPos.y &&
				lPos2.x < bottomRight.x &&
				lPos2.y < bottomRight.y
			)
		) {
			return true;
		}
		let topRight = {x: rPos.x + rWid, y: rPos.y};
		let bottomLeft = {x: rPos.x, y: rPos.y + rHgt};
		return (
			ice.physics.lineInLine(lPos1, lPos2, rPos, topRight) ||
			ice.physics.lineInLine(lPos1, lPos2, rPos, bottomLeft) ||
			ice.physics.lineInLine(lPos1, lPos2, bottomRight, topRight) ||
			ice.physics.lineInLine(lPos1, lPos2, bottomRight, bottomLeft)
		);
	}
	ice.physics.lineOnRect = function(lPos1, lPos2, rPos, rWid, rHgt) {
		let bottomRight = {x: rPos.x + rWid, y: rPos.y + rHgt};
		if(
			lPos1.x <= rPos.x &&
			lPos1.y <= rPos.y &&
			lPos2.x <= rPos.x &&
			lPos2.y <= rPos.y &&
			lPos1.x >= bottomRight.x &&
			lPos1.y >= bottomRight.y &&
			lPos2.x >= bottomRight.x &&
			lPos2.y >= bottomRight.y
		) {
			return true;
		}
		let topRight = {x: rPos.x + rWid, y: rPos.y};
		let bottomLeft = {x: rPos.x, y: rPos.y + rHgt};
		return (
			ice.physics.lineOnLine(lPos1, lPos2, rPos, topRight) ||
			ice.physics.lineOnLine(lPos1, lPos2, rPos, bottomLeft) ||
			ice.physics.lineOnLine(lPos1, lPos2, bottomRight, topRight) ||
			ice.physics.lineOnLine(lPos1, lPos2, bottomRight, bottomLeft)
		);
	}
	ice.physics.lineInLine = function(l1Pos1, l1Pos2, l2Pos1, l2Pos2) {
		let l1Pos1A = lineHelper(l2Pos1, l2Pos2, l1Pos1);
		let l1Pos2A = lineHelper(l2Pos1, l2Pos2, l1Pos2);
		if((l1Pos1A > 0 && l1Pos2A < 0) || (l1Pos2A > 0 && l1Pos1A < 0)) {
			let l2Pos1A = lineHelper(l1Pos1, l1Pos2, l2Pos1);
			let l2Pos2A = lineHelper(l1Pos1, l1Pos2, l2Pos2);
			return (l2Pos1A > 0 && l2Pos2A < 0) || (l2Pos2A > 0 && l2Pos1A < 0);
		}
		else {
			return false;
		}
	}
	ice.physics.lineOnLine = function(l1Pos1, l1Pos2, l2Pos1, l2Pos2) {
		let l1Pos1A = lineHelper(l2Pos1, l2Pos2, l1Pos1);
		let l1Pos2A = lineHelper(l2Pos1, l2Pos2, l1Pos2);
		if((l1Pos1A >= 0 && l1Pos2A < 0) || (l1Pos2A >= 0 && l1Pos1A < 0)) {
			let l2Pos1A = lineHelper(l1Pos1, l1Pos2, l2Pos1);
			let l2Pos2A = lineHelper(l1Pos1, l1Pos2, l2Pos2);
			return (l2Pos1A >= 0 && l2Pos2A < 0) || (l2Pos2A >= 0 && l2Pos1A < 0);
		}
		else {
			return false;
		}
	}
})();
