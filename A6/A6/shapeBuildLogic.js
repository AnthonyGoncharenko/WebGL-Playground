var sq;
var smf;
var sph;


function divideTriangle(x1, x2, x3, numDivisions) {
  if (numDivisions > 0) {
    let v1 = normalize(add(x1, x2));
    let v2 = normalize(add(x1, x3));
    let v3 = normalize(add(x2, x3));
    divideTriangle(x1, v1, v2, numDivisions - 1);
    divideTriangle(x3, v2, v3, numDivisions - 1);
    divideTriangle(x2, v3, v1, numDivisions - 1);
    divideTriangle(v1, v3, v2, numDivisions - 1);
  } else {
    triangle(x1, x2, x3);
  }
}
function triangle(x1, x2, x3) {
  let color = vec4(Math.random(), Math.random(), Math.random(), 1.0);
  vertexPositionsSphere.push(x1);
  vertexColorsSphere.push(color);
  vertexPositionsSphere.push(x2);
  vertexColorsSphere.push(color);
  vertexPositionsSphere.push(x3);
  vertexColorsSphere.push(color);
}

var vertexPositionsSphere = [];
var vertexColorsSphere = [];
const buildSphere = (numDivisions) => {
  if (vertexColorsSphere.length === 0) {
    let sqrt2 = Math.sqrt(2.0);
    let sqrt6 = Math.sqrt(6.0);
    let vertices = [
      vec3(0, 0, 1),
      vec3(0, 2 * sqrt2 / 3, -1.0 / 3),
      vec3(-sqrt6 / 3.0, -sqrt2 / 3.0, -1.0 / 3),
      vec3(sqrt6 / 3.0, -sqrt2 / 3.0, -1.0 / 3)
    ];

    divideTriangle(vertices[0], vertices[1], vertices[2], numDivisions);
    divideTriangle(vertices[3], vertices[2], vertices[1], numDivisions);
    divideTriangle(vertices[0], vertices[3], vertices[1], numDivisions);
    divideTriangle(vertices[0], vertices[2], vertices[3], numDivisions);

  }
  sph = new Drawable("Sphere")
    .initializeShaders(gl, vshader2, fshader2)
    .initializePositionBuffer(vertexPositionsSphere)
    .initializeColorBuffer(vertexColorsSphere)
    .initializeModelMatrix3D(
      (tx = 0),
      (ty = 0),
      (tz = 0),
      (sx = 1),
      (sy = 1),
      (sz = 1),
      (rotX = 0),
      (rotY = 0),
      (rotZ = 0)
    )
    .initializeCameraMatrix()
    .initializeProjectionMatrix(90, 0.1, 10);

  sph.draw = (dimension, drawStyle) => {
    sph.useProgram()
      .bindPositionBuffer(dimension)
      .bindColorBuffer()
      .bindModelMatrixUniform()
      .bindProjectionMatrix()
      .bindUniformCameraMatrix()
      .drawAndDestruct(drawStyle);
  }
}


var vertexPositionsDragon = [];
var vertexColorsDragon = [];
var indicesDragon = [];
const buildDragon = (filename) => {
  if (vertexPositionsDragon.length === 0) {
    let lines = loadFileAJAX(filename).split("\n");
    for (const line of lines) {
      let [type, ...nums] = line.trimRight().split(" ");
      let color = vec4(Math.random(), Math.random(), Math.random(), 1.0);
      switch (type) {
        case "v":
          vertexPositionsDragon.push(vec3(...nums.map((x) => parseFloat(x))));
          vertexColorsDragon.push(color);
          break;
        case "f":
          indicesDragon.push(...nums.map((x) => parseInt(x) - 1));
          break;
      }
    }
  }
  smf = new Drawable("Dragon")
    .initializeShaders(gl, vshader2, fshader2)
    .initializePositionBuffer(vertexPositionsDragon)
    .initializeColorBuffer(vertexColorsDragon)
    .initializeElementArrayBuffer(indicesDragon)
    .initializeModelMatrix3D(
      (tx = 0),
      (ty = 0),
      (tz = 0),
      (sx = 1),
      (sy = 1),
      (sz = 1),
      (rotX = 0),
      (rotY = 0),
      (rotZ = 0)
    )
    .initializeCameraMatrix()
    .initializeProjectionMatrix(90, 0.1, 10);

  smf.draw = (dimension, drawStyle) => {
    smf.useProgram()
      .bindPositionBuffer(dimension)
      .bindColorBuffer()
      .bindElementArrayBuffer()
      .bindModelMatrixUniform()
      .bindProjectionMatrix()
      .bindUniformCameraMatrix()
      .drawAndDestructElements(drawStyle);
  }
};
