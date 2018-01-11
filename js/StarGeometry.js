"use strict";
let StarGeometry = function(gl) {
  this.gl = gl;

  let starVertices = [0.0, 0.0, 0.0];
  let vertexColors = [1.0, 1.0, 0.0];
  for(var i =1; i<=10; i++){
    if(i%2 == 0){
      starVertices.push(0.5*Math.cos((Math.PI/2)+(i*Math.PI/5)), 0.5*Math.sin((Math.PI/2)+(i*Math.PI/5)), 0.0);
    }
    else{
      starVertices.push(0.25*Math.cos((Math.PI/2)+(i*Math.PI/5)), 0.25*Math.sin((Math.PI/2)+(i*Math.PI/5)), 0.0);
    }
    vertexColors.push(1.0, 1.0, 0.0);
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
    new Float32Array(starVertices),
    gl.STATIC_DRAW);

  // index buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,
      0, 2, 3,
      0, 3, 4,
      0, 4, 5,
      0, 5, 6,
      0, 6, 7,
      0, 7, 8,
      0, 8, 9,
      0, 9, 10,
      0, 10, 1,
    ]),
    gl.STATIC_DRAW);

};

StarGeometry.prototype.draw = function() {
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

  gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0);
};
