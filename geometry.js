function innerProduct(a, b) {
  return a.x * b.x + a.y * b.y;
}

class Vector {
  constructor(x, y, label=1, arrowheadSize=100) {
    this.x = x;
    this.y = y;
    this.label = label ? label : 1;  // labels are +/-1
    this.arrowheadSize = arrowheadSize;

    this.labelToColor = {
      '-1': 'red',
      '1': 'green',
    };
    this.labelToStrokeColor = {
      '-1': '#330000',
      '1': '#003300',
    };
  }

  toString() {
    let roundedX = Math.round(this.x * 100) / 100;
    let roundedY = Math.round(this.y * 100) / 100;
    return `(${roundedX}, ${roundedY})`;
  }

  arrowheadOffset() {
    let angleFromHorizontal = Math.atan2(this.y, this.x);
    let angleFromVertical = Math.PI/2 - angleFromHorizontal;
    let angleDeg = parseInt(angleFromVertical * 180 / Math.PI);
    let halfLength = Math.sqrt(this.arrowheadSize) / 2;
    let arrowheadOffsetX = - halfLength * Math.cos(angleFromHorizontal);
    let arrowheadOffsetY = halfLength * Math.sin(angleFromHorizontal);
    return [arrowheadOffsetX, arrowheadOffsetY, angleDeg];
  }

  normalized() {
    let norm = Math.sqrt(this.x * this.x + this.y * this.y);
    return new Vector(this.x / norm, this.y / norm);
  }

  project(w) {
    // project this onto the input vector w
    let normW = Math.sqrt(innerProduct(w, w));
    let normalizedW = w.normalized();
    let signedLength = innerProduct(this, normalizedW);

    return new Vector(
      normalizedW.x * signedLength,
      normalizedW.y * signedLength
    );
  }
}


module.exports = {
  Vector,
  innerProduct,
};
