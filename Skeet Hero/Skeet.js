function Skeet() {
	let gravity = new physics.Vector(0, 0.0057142857142857 * 2); // 2 1 0.5 0.25 0.125 0.0625 0.03125, 0.015625

	this.pos = new physics.Vector(math.coinFlip() ? 0 : width, math.random(midHeight, height));
	this.initPos = this.pos.clone();
	this.target = this.pos.clone().addX(700).modX(1400);
	this.vel = new physics.Vector(this.pos.x === 0 ? 2 : -2, -2);
	this.rad = 15
	this.dead = false;

	this.tick = function() {
		this.pos.add(this.vel);
		this.vel.add(gravity);

		if(physics.pointInRect(this.pos, physics.origin(), size)) this.dead = true;
	}
	this.render = function() {
		fill("#FF4000");
		noStroke();
		point(this.pos, this.rad);

		stroke(255, 64, 0, 0.5);
		line(this.pos, this.target);

		stroke(colors.RED);
		line(this.initPos, this.target);
	}
}
