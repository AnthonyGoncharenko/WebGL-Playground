var sq;
var py;
var pyr;

const buildSquare = () => {
    // A green ground plane on the xz plane at y = 0.
    var vertexPositions = [
        vec3(-1, 0, -1),
        vec3(1, 0, -1),
        vec3(1, 0, 1),
        vec3(-1, 0, -1),
        vec3(1, 0, 1),
        vec3(-1, 0, 1)
    ];

    sq = new Drawable('Square')
        .initializeShaders(gl, vshader0, fshader0)
        .initializePositionBuffer(vertexPositions)
        .initializeUniformColor(GREEN)
        .initializeModelMatrix3D(tx = 0, ty = 0, tz = 0, sx = 2.5, sy = 0, sz = 2.5, rotX = 0, rotY = 0, rotZ = 0)
        .initializeCameraMatrix()
        .initializeProjectionMatrix();
}

const buildPyramid = (vshader, fshader) => {

    let vertexPositions = [
        vec3(-1, 0, 1),
        vec3(1, 0, 1),
        vec3(-1, 0, -1),
        vec3(1, 0, -1),
        vec3(0, 1, 0)
    ];

    let vertexColors = [
        RED,
        YELLOW,
        CYAN,
        BLUE,
        MAGENTA,
    ];
    let indices = [
        0, 1, 3,
        0, 3, 2,
        3, 1, 4,
        3, 4, 2,
        0, 2, 4,
        0, 4, 1
    ];
    py = new Drawable('Pyramid')
        .initializeShaders(gl, vshader, fshader)
        .initializePositionBuffer(vertexPositions)
        .initializeWireFrameBuffer(indices)
        .initializeColorBuffer(vertexColors)
        .initializeModelMatrix3D(tx = 0, ty = 0, tz = 0, sx = 1, sy = 1, sz = 1, rotX = 0, rotY = 0, rotZ = 0)
        .initializeCameraMatrix()
        .initializeProjectionMatrix();

    if (pyr === undefined){
        pyr = new Drawable('PyramidFrame')
            .initializeShaders(gl, vshader3, fshader1)
            .initializeWireFrameBuffer(indices)
            .initializeModelMatrix3D(tx = 0, ty = 0, tz = 0, sx = 1.0, sy = 1.0, sz = 1.0, rotX = 0, rotY = 0, rotZ = 0)
            .initializeCameraMatrix()
            .initializeProjectionMatrix();
    }
}

