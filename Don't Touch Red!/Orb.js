class Enemy {
	constructor(speed, vel) {
		this.speed = speed;
		this.pos = physics.origin();
		this.vel = vel.setMag(this.speed);
		this.acc = physics.origin();
		this.rad = math.randomInt(4, 32);
		this.color = colors.RED;
		this.alive = true;
		if(math.coinFlip()) {
			this.pos.x = math.randomInt(width);
			this.pos.y = coinFlip() ? -this.rad : height + this.rad;
		}
		else {
			this.pos.x = coinFlip() ? -this.rad : width + this.rad;
			this.pos.y = math.randomInt(height);
		}
	}
	applyForce(force) {
		this.acc.add(force);
	}
	render() {
		fill(this.color);
		noStroke();
		point(this.pos, this.rad);
	}
	tick() {
		this.pos.add(this.vel);
		this.vel.add(this.acc).clampMag(this.speed);
		this.acc.set(0);
		if(
			this.rad < 4 ||
			this.pos.x < -this.rad ||
			this.pos.x > width + this.rad ||
			this.pos.y < -this.rad ||
			this.pos.y > height + this.rad
		) this.dead = true;
	}
}

class Orb extends Enemy {
	constructor() {
		super(math.random(1, 5), physics.random());
	}
}

class Seeker extends Orb {
	constructor() {
		super(math.random(1, 5), physics.origin());
	}
	tick() {
		this.rad -= 0.1;
		super.applyForce(pos.clone().subtract(this.pos).normalize());
		super.tick();
	}
	render() {
		super.render();
		fill(colors.MAROON);
		noStroke();
		point(this.pos, this.rad - 2);
	}
}
