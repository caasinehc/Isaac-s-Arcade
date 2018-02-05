class Orb {
	constructor() {
		this.pos = new physics.Vector();
		this.vel = physics.random().setMag(math.random(1, 5));
		this.rad = math.randomInt(4, 32);
		this.alive = true;
		if(math.coinFlip()) {
			this.pos.x = math.randomInt(width);
			this.vel.invertX();
			this.pos.y = coinFlip() ? -this.rad : height + this.rad;
		}
		else {
			this.pos.x = coinFlip() ? -this.rad : width + this.rad;
			this.pos.y = math.randomInt(height);
		}
	}
	render() {
		fill(colors.RED);
		noStroke();
		point(this.pos, this.rad);
	}
	tick() {
		this.pos.add(this.vel);
		if(
			this.pos.x < -this.rad ||
			this.pos.x > width + this.rad ||
			this.pos.y < -this.rad ||
			this.pos.y > height + this.rad
		) this.dead = true;
	}
}
