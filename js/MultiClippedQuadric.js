let MultiClippedQuadric =
           function(surfaceCoeffMatrix, clipperCoeffMatrix1, clipperCoeffMatrix2) {
  this.surfaceCoeffMatrix = surfaceCoeffMatrix;
  this.clipperCoeffMatrix1 = clipperCoeffMatrix1;
  this.clipperCoeffMatrix2 = clipperCoeffMatrix2;
}

MultiClippedQuadric.prototype.setUnitPlane = function() {
  this.surfaceCoeffMatrix.set(
    0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -0.0001);
  this.clipperCoeffMatrix1.set(
    1, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix2.set(
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1);
}

MultiClippedQuadric.prototype.setUnitParabaloid = function() {
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
		0, 0, 0, -1,
		0, 0, 1, 0,
		0, 0, 0, 0);
  this.clipperCoeffMatrix1.set(
    0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix2.set(
    0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -0.7);
}

MultiClippedQuadric.prototype.setUnitHyperboloid = function() {
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
		0, -1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix1.set(
    0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix2.set(
    0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -0.7);
}

MultiClippedQuadric.prototype.transform =  function(t) {
  var tInverse = new Mat4().set(t).invert();
  var tPose = new Mat4().set(t).invert().transpose();
  this.surfaceCoeffMatrix.premul(tInverse).mul(tPose);
  this.clipperCoeffMatrix1.premul(tInverse).mul(tPose);
  this.clipperCoeffMatrix2.premul(tInverse).mul(tPose);

}
