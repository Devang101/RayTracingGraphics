"use strict";
let GameObject = function(mesh) {
  this.mesh = mesh;
  this.angularVelocity = 0;
  this.position = new Vec3(0, 0, 0);
  this.orientation = new Vec4(0, 0, 0, 0);
  this.scale = new Vec3(1, 1, 1);
  this.modelMatrix = new Mat4();
  this.timeAtLastFrame = new Date().getTime();
};
GameObject.prototype.updateModelMatrix =
                              function(){
// TODO: set the model matrix according to the position, orientation, and scale
let timeAtThisFrame = new Date().getTime();
let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
this.timeAtLastFrame = timeAtThisFrame;
this.orientation = this.orientation + this.angularVelocity * dt;
this.modelMatrix.set().rotate(this.orientation).scale(this.scale).translate(this.position);
};

GameObject.prototype.draw = function(camera, lightSources){

this.updateModelMatrix();

  Material.modelViewProjMatrix.
    set(this.modelMatrix).
    mul(camera.viewProjMatrix);
    Material.modelMatrix.set(this.modelMatrix);
    Material.modelMatrixInverse.set(new Mat4(this.modelMatrix).invert());
    Material.eyePosition.set(camera.position);
    Material.rayDirMat.set(camera.rayDirMat);

    for(var i=0; i<lightSources.length; i++){
        Material.lightPos.at(i).set(lightSources[i].lightPos);
        Material.lightPowerDensity.at(i).set(lightSources[i].lightPowerDensity);
        Material.spotlightDir.at(i).set(lightSources[i].spotlightDir);
    }

    this.mesh.draw()
};
