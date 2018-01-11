let ClippedQuadric =
           function(surfaceCoeffMatrix, clipperCoeffMatrix) {
  this.surfaceCoeffMatrix = surfaceCoeffMatrix;
  this.clipperCoeffMatrix = clipperCoeffMatrix;
}

ClippedQuadric.prototype.setUnitSphere = function(){
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(
    0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
}

ClippedQuadric.prototype.setUnitCylinder = function() {
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(
    0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
}

ClippedQuadric.prototype.setUnitCone = function() {
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
		0, -1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 0);
  this.clipperCoeffMatrix.set(
    0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
}

ClippedQuadric.prototype.setUnitHyperboloid = function() {
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
		0, -1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(
    0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
}

ClippedQuadric.prototype.setUnitParabaloid = function() {
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
		0, 0, 0, -1,
		0, 0, 1, 0,
		0, 0, 0, 0);
  this.clipperCoeffMatrix.set(
    0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
}

ClippedQuadric.prototype.transform =  function(t) {
  var tInverse = new Mat4().set(t).invert();
  var tPose = new Mat4().set(t).invert().transpose();
  this.surfaceCoeffMatrix.premul(tInverse).mul(tPose);
  this.clipperCoeffMatrix.premul(tInverse).mul(tPose);
}

ClippedQuadric.prototype.transformClipper =  function(t) {
  var tInverse = new Mat4().set(t).invert();
  var tPose = new Mat4().set(t).invert().transpose();
  this.clipperCoeffMatrix.premul(tInverse).mul(tPose);
}
