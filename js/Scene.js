"use strict";
let Scene = function(gl) {
  gl.enable(gl.DEPTH_TEST);
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.vsTexture = new Shader(gl, gl.VERTEX_SHADER, "texture_vs.essl");
  this.fsTexture = new Shader(gl, gl.FRAGMENT_SHADER, "texture_fs.essl");
  this.vs3DTrans = new Shader(gl, gl.VERTEX_SHADER, "3DTrans_vs.essl");
  this.fs3DTrans = new Shader(gl, gl.FRAGMENT_SHADER, "3DTrans_fs.essl");
  this.fsEnvMap = new Shader(gl, gl.FRAGMENT_SHADER, "envMap_fs.essl");
  this.fsBackground = new Shader(gl, gl.FRAGMENT_SHADER, "background_fs.essl");
  this.vsBackground = new Shader(gl, gl.VERTEX_SHADER, "background_vs.essl");

  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.textureProgram = new TexturedProgram(gl, this.vsTexture, this.fsTexture);
  this.Trans3DProgram = new TexturedProgram(gl, this.vs3DTrans, this.fs3DTrans);
  this.envMapProgram = new TexturedProgram(gl, this.vs3DTrans, this.fsEnvMap);
  this.backgroundProgram = new TexturedProgram(gl, this.vsBackground, this.fsBackground)

  this.slowpokeMaterial = new Material(gl, this.envMapProgram);
  this.slowpokeEyeMaterial = new Material(gl, this.envMapProgram);
  this.backgroundMaterial = new Material(gl, this.backgroundProgram);

  this.texturedQuadGeometry = new TexturedQuadGeometry(gl);
  this.textureBackground = new Texture2D(gl, "envmaps/probe2017fall1.png");

  this.slowpokeMaterial.probeTexture.set(this.textureBackground);
  this.slowpokeEyeMaterial.probeTexture.set(this.textureBackground);
  this.backgroundMaterial.probeTexture.set(this.textureBackground);

  this.backgroundMesh = new Mesh(this.texturedQuadGeometry, this.backgroundMaterial);

  this.camera = new PerspectiveCamera();
  this.timeAtLastFrame = new Date().getTime();

  this.background = new GameObject(this.backgroundMesh);

  this.pawnHead = new ClippedQuadric(new Mat4(), new Mat4());
  this.pawnHead.setUnitSphere();
  this.pawnHead.transform(new Mat4().scale(0.2,0.2,0.2).translate(0.5,-1,3.2));
  Material.quadrics.at(0).set(this.pawnHead.surfaceCoeffMatrix);
  Material.quadrics.at(1).set(this.pawnHead.clipperCoeffMatrix);
  Material.brdfs.at(0).set(1, 10, 1, 3);

  this.pawnBody = new ClippedQuadric(new Mat4(), new Mat4());
  this.pawnBody.setUnitCone();
  this.pawnBody.transformClipper(new Mat4().translate(0,-1,0));
  this.pawnBody.transform(new Mat4().scale(0.2,0.55,0.2).translate(0.5,-1,3.2));
  Material.quadrics.at(2).set(this.pawnBody.surfaceCoeffMatrix);
  Material.quadrics.at(3).set(this.pawnBody.clipperCoeffMatrix);
  Material.brdfs.at(1).set(1, 10, 1, 3);

  this.kingHead = new ClippedQuadric(new Mat4(), new Mat4());
  this.kingHead.setUnitParabaloid();
  this.kingHead.transform(new Mat4().scale(0.3,0.5,0.3).translate(-0.7,-0.2,2.2));
  Material.quadrics.at(4).set(this.kingHead.surfaceCoeffMatrix);
  Material.quadrics.at(5).set(this.kingHead.clipperCoeffMatrix);
  Material.brdfs.at(2).set(10, 1, 1, 0);

  this.kingBody = new ClippedQuadric(new Mat4(), new Mat4());
  this.kingBody.setUnitCone();
  this.kingBody.transformClipper(new Mat4().translate(0,-1,0));
  this.kingBody.transform(new Mat4().scale(0.2,0.99,0.2).translate(-0.7,0,2.2));
  Material.quadrics.at(6).set(this.kingBody.surfaceCoeffMatrix);
  Material.quadrics.at(7).set(this.kingBody.clipperCoeffMatrix);
  Material.brdfs.at(3).set(10, 1, 1, 0);

  this.queenBody = new ClippedQuadric(new Mat4(), new Mat4());
  this.queenBody.setUnitHyperboloid();
  this.queenBody.transform(new Mat4().scale(0.25,0.8,0.25).translate(0.7,-1.1,2.2));
  Material.queens.at(0).set(this.queenBody.surfaceCoeffMatrix);
  Material.queens.at(1).set(this.queenBody.clipperCoeffMatrix);
  Material.queensBrdfs.at(0).set(1, 1, 10, 0);

  this.board = new MultiClippedQuadric(new Mat4(), new Mat4(), new Mat4());
  this.board.setUnitPlane();
  this.board.transform(new Mat4().scale(6,1,6).translate(0,-2,0));
  Material.multiClipQuadrics.at(0).set(this.board.surfaceCoeffMatrix);
  Material.multiClipQuadrics.at(1).set(this.board.clipperCoeffMatrix1);
  Material.multiClipQuadrics.at(2).set(this.board.clipperCoeffMatrix2);
  Material.multiClipBrdfs.at(0).set(1, 1, 1, 1);

  this.rookHead = new MultiClippedQuadric(new Mat4(), new Mat4(), new Mat4());
  this.rookHead.setUnitParabaloid();
  this.rookHead.transform(new Mat4().scale(0.5,0.6,0.5).translate(-1.2,-1.3,3));
  Material.multiClipQuadrics.at(3).set(this.rookHead.surfaceCoeffMatrix);
  Material.multiClipQuadrics.at(4).set(this.rookHead.clipperCoeffMatrix1);
  Material.multiClipQuadrics.at(5).set(this.rookHead.clipperCoeffMatrix2);
  Material.multiClipBrdfs.at(1).set(10, 10, 1, 0);

  this.rookBody = new MultiClippedQuadric(new Mat4(), new Mat4(), new Mat4());
  this.rookBody.setUnitHyperboloid();
  this.rookBody.transform(new Mat4().scale(0.2,0.5,0.2).translate(-1.2,-1.5,3));
  Material.multiClipQuadrics.at(6).set(this.rookBody.surfaceCoeffMatrix);
  Material.multiClipQuadrics.at(7).set(this.rookBody.clipperCoeffMatrix1);
  Material.multiClipQuadrics.at(8).set(this.rookBody.clipperCoeffMatrix2);
  Material.multiClipBrdfs.at(2).set(10, 10, 1, 0);

  //Light sources
  this.sun = new LightSource();
  this.sun.lightPos = new Vec4(1.0,1.0,1.0,0.0);
  this.sun.lightPowerDensity = new Vec4(0.5,0.5,0.5,0.0);

  this.lightSources = [this.sun];
  //initiallize gameObjects
  this.gameObjects = [this.background];

  this.onmousedown = function() {
    this.camera.mouseDown();
  };
  this.onmouseup = function(){
    this.camera.mouseUp();
  };

  this.onmousemove = function(event){
    this.camera.mouseMove(event);
  };
};


Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false

  // clear the
  gl.clearColor(0.3, 0.4, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  this.camera.move(dt, keysPressed);

  this.rookHead.setUnitParabaloid();
  this.rookHead.transform(new Mat4().scale(0.5,0.6,0.5).translate(-1.2,-1.3,3));
  this.rookHead.transform(new Mat4().translate(
    3*Math.cos(timeAtThisFrame/1000),
    0,
    3*Math.sin(timeAtThisFrame/1000)));
  Material.multiClipQuadrics.at(3).set(this.rookHead.surfaceCoeffMatrix);
  Material.multiClipQuadrics.at(4).set(this.rookHead.clipperCoeffMatrix1);
  Material.multiClipQuadrics.at(5).set(this.rookHead.clipperCoeffMatrix2);
  Material.multiClipBrdfs.at(1).set(10, 10, 1, 0);

  this.rookBody.setUnitHyperboloid();
  this.rookBody.transform(new Mat4().scale(0.2,0.5,0.2).translate(-1.2,-1.5,3));
  this.rookBody.transform(new Mat4().translate(
    3*Math.cos(timeAtThisFrame/1000),
    0,
    3*Math.sin(timeAtThisFrame/1000)));
  Material.multiClipQuadrics.at(6).set(this.rookBody.surfaceCoeffMatrix);
  Material.multiClipQuadrics.at(7).set(this.rookBody.clipperCoeffMatrix1);
  Material.multiClipQuadrics.at(8).set(this.rookBody.clipperCoeffMatrix2);
  Material.multiClipBrdfs.at(2).set(10, 10, 1, 0);

  this.kingHead.setUnitParabaloid();
  this.kingHead.transform(new Mat4().scale(0.3,0.5,0.3).translate(-0.7,-0.2,2.2));
  this.kingHead.transform(new Mat4().translate(
    2*Math.cos(timeAtThisFrame/1000),
    2*Math.cos(timeAtThisFrame/1000) +2,
    2*Math.sin(timeAtThisFrame/1000)));
  Material.quadrics.at(4).set(this.kingHead.surfaceCoeffMatrix);
  Material.quadrics.at(5).set(this.kingHead.clipperCoeffMatrix);
  Material.brdfs.at(2).set(10, 1, 1, 0);

  this.kingBody.setUnitCone();
  this.kingBody.transformClipper(new Mat4().translate(0,-1,0));
  this.kingBody.transform(new Mat4().scale(0.2,0.99,0.2).translate(-0.7,0,2.2));
  this.kingBody.transform(new Mat4().translate(
    2*Math.cos(timeAtThisFrame/1000),
    2*Math.cos(timeAtThisFrame/1000) +2,
    2*Math.sin(timeAtThisFrame/1000)));
  Material.quadrics.at(6).set(this.kingBody.surfaceCoeffMatrix);
  Material.quadrics.at(7).set(this.kingBody.clipperCoeffMatrix);
  Material.brdfs.at(3).set(10, 1, 1, 0);

  for (var i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].draw(this.camera, this.lightSources);
  }
};
