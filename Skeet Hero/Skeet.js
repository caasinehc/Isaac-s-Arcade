function Skeet() {
	let gravity = new physics.Vector(0, 0.0125);

	this.pos = new physics.Vector(math.coinFlip() ? 0 : width, math.random(midHeight, height));
	this.vel = new physics.Vector(this.pos.x === 0 ? 2 : -2, -2);
	this.dead = false;

	this.tick = function() {
		this.pos.add(this.vel);
		this.vel.add(gravity);
	}
	this.render = function() {
		fill("#FF4000");
		noStroke();
		point(this.pos, 15);
	}
}
