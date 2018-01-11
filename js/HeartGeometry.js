"use strict";
let HeartGeometry = function(gl) {
  this.gl = gl;

  let heartVertices = [0.0, 0.0, 0.0];
  let vertexColors = [1.0, 0.0, 0.0];
  for(var i =1; i<145; i++){
    var currentAngle = i*Math.PI/72
    var xValue = 16*Math.pow(Math.sin(currentAngle),3);
    var yValue = 	13*Math.cos(currentAngle)-5*Math.cos(2*currentAngle)-2*Math.cos(3*currentAngle)-Math.cos(4*currentAngle);
    heartVertices.push(xValue/40, yValue/40, 0.0);
    vertexColors.push(1.0, 0.0, 0.0);
  }
  // vertex color buffer
  this.vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(vertexColors),
    gl.STATIC_DRAW);

  // vertex buffer
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(heartVertices),
    gl.STATIC_DRAW);

  // index buffer
  let indexes = [];
  for(var i=1; i<=143;i++){
    indexes.push(0, i, (i+1));
  }
  indexes.push(0,144,1);
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indexes),
    gl.STATIC_DRAW);

};

HeartGeometry.prototype.draw = function() {
  let gl = this.gl;
  // set vertex buffer to pipeline input
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  // set vertex color buffer to pipeline input
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  // set index buffer to pipeline input
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  gl.drawElements(gl.TRIANGLES, 432, gl.UNSIGNED_SHORT, 0);
};
