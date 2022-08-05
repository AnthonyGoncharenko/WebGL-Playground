var canvas;
var gl;
var TRIANGLE_FAN;
var TRIANGLES;
var interpolated;
var cam;
var shape = undefined;
var r;
var h;
var theta;
var root2 = Math.sqrt(2);
var vshader0 = "/vshader.glsl";
var vshader1 = "/vshader1.glsl";
var vshader2 = "/vshader2.glsl";
var vshader3 = "/vshader3.glsl";

var fshader0 = "/fshader.glsl";
var fshader1 = "/fshader1.glsl";
var fshader2 = "/fshader2.glsl";

window.onload = () => {
  canvas = document.getElementById("gl-canvas");
  gl = canvas.getContext("webgl2");
  TRIANGLE_FAN = gl.TRIANGLE_FAN;
  TRIANGLES = gl.TRIANGLES;
  LINES = gl.LINES;
  sphere = true;
  if (!gl) {
    alert("WebGL 2.0 isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.enable(gl.DEPTH_TEST);
  cam = new Camera(
    (vrp = vec3(0, 2, 2)),
    (u = vec3(1, 0, 0)),
    (v = vec3(0, root2 / 2, -root2 / 2)),
    (n = vec3(0, root2 / 2, root2 / 2))
  );
  r = 2;
  h = 2;
  theta = 0;
  buildSphere(4);
  buildDragon("/bunny_69k.smf");
  shape = sph;
  render();
};

function render() {
  setTimeout(() => {
    requestAnimationFrame(render);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    shape.draw(3, TRIANGLES);
    theta = (theta - 0.1) % 360;
    cam.vrp = vec3(
      r * Math.sin(theta),
      h,
      r * Math.cos(theta),
    )
    let origin = vec3(0, 0, 0);
    cam.n = normalize(subtract(cam.vrp, origin));
    cam.u = cross(vec3(0, 1, 0), cam.n);
    cam.v = cross(cam.n, cam.u);
    cam.updateCameraMatrix();
  }, 100);
}

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "Space":
      sphere = !sphere;
      shape = (sphere) ? sph : smf;
      break;
  }
});
