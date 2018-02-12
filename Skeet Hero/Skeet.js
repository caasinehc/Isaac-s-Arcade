function Skeet() {
	this.pos = new physics.Vector(math.coinFlip() ? 0 : width, math.random(midHeight, height));
	this.vel = new physics.Vector(this.pos.x === 0 ? 3 : -3, -3);
	this.acc = new physics.Vector(0, abs(this.vel.x) * this.vel.y * -2 / width);
	this.rad = 15;
	this.offTheMap = false;
	this.dead = false;

	this.lines = function() {
		let clone = new Skeet();
		clone.pos = this.pos.clone();
		clone.vel = this.vel.clone();
		clone.acc = this.acc.clone();

		stroke(255, 64, 0, 1);
		line(clone.pos, clone.pos.clone().add(clone.vel.clone().mult(25)));

		let pointList = [clone.pos.clone()];
		for(let i = 0; i < width; i++) {
			clone.tick();
			if(clone.dead) break;
			pointList.push(clone.pos.clone());
		}

		stroke(255, 64, 0, 0.5);
		lines(pointList);
	}

	this.tick = function() {
		this.pos.add(this.vel);
		this.vel.add(this.acc);
		if(cheats.magneto && this.pos.distSq(mousePos) > 10) this.vel.towards(mousePos.clone().subtract(this.pos), 20 / this.pos.distSq(mousePos));
		if(this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) this.offTheMap = this.dead = true;
	}
	this.render = function() {
		fill("#FF4000");
		noStroke();
		point(this.pos, this.rad);

		if(cheats.lines) this.lines();
	}
}
