class Bot {
	constructor(topSpeed = 4, range = 32) {
		this.topSpeed = topSpeed;
		this.range = range;
	}
	getAwayVel(otherPos) {
		return pos.clone().subtract(otherPos);
	}
	getTowardsVel(otherPos) {
		return otherPos.clone().subtract(pos);
	}
	tick(enemies) {
		let desVel = physics.origin();
		let threats = 0;

		for(let enemy of enemies) {
			let dist = enemy.pos.dist(pos) - enemy.rad - 8;
			if(dist <= this.range) {
				desVel.add(this.getAwayVel(enemy.pos).setMag(math.map(dist * dist, 0, this.range * this.range, this.topSpeed, 0)));
				threats++;
			}
		}
		if(threats) desVel.divide(threats);
		else desVel.set(this.getTowardsVel(middle).mult(0.5));
		desVel.clampMag(this.topSpeed);
		for(let enemy of enemies) {
			if(physics.circleInCircle(pos, 9, enemy.pos, enemy.rad)) {
				boardWipe();
				return;
			}
		}
		pos.add(desVel);
	}
}
