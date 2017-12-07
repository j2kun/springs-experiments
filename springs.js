import { Vector } from './geometry';

class Bead {
  constructor(x, y, mass=1) {
    this.position = Vector(x, y);
    this.velocity = Vector(0, 0);
    this.acceleration = Vector(0, 0);
  }
}

class SpringForce {
  constructor(bead1, bead2, springConstant=1, equilibriumLength=100) {
    let displacementVector = bead2.subtract(bead1);
    this.distance = displacementVector.norm();
    this.forceMagnitude = springConstant * Math.abs(this.distance - equilibriumLength);
    this.forceOnBead1 = displacementVector.normalized().scale(forceMagnitude);
    this.forceOnBead2 = displacementVector.normalized().scale(-forceMagnitude);
  }
}

class System {
  constructor(numBeads=5, distanceBetween=100, leftEndpoint=[-250, 0]) {
    this.beads = [];
    let fixedBeadIndices = [0, 1 + numBeads];
    // add two extra "special" beads for the two ends of the string
    for (let i = 0; i < numBeads + 2; i++) {
      this.beads.push(Bead(leftEndpoint[0] + i*numBeads, leftEndpoint[1]));
    }
  }

  simulateStep() {
    // Construct all the force objects
    // Sum the forces for each bead, set to acceleration
    // Iterate the acceleration, then velocity, then position
  }
}

module.exports = {
  System
};
