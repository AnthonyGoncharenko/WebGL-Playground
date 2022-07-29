var pg;
var ci;
var tr;
var el;


let squares = [];
const buildSquares = (center) => {
    for (let i = 6; i >= 1; i--) {
        var vertexPositions = [
            vec2(-i * .1, -i * .1),
            vec2(-i * .1, i * .1),
            vec2(i * .1, i * .1),
            vec2(i * .1, -i * .1)
        ];
        var sq = new Drawable('Square ' + i)
            .initializeShaders(gl, "/vshader.glsl", "/fshader.glsl")
            .initializePositionBuffer(vertexPositions)
            .initializeUniformColor(i % 2 == 0 ? WHITE : BLACK)
            .initializeModelMatrix(center[0], center[1], 1, 0);

        squares.push(sq);
    }
}

const buildTriangle = (center, vertexColors) => {
    let A = 1 / 6;
    let angle = 0;
    let vertexPositions = [
        vec2(A * Math.cos(angle), A * Math.sin(angle)),
        vec2(A * Math.cos(angle + 2 * Math.PI / 3), A * Math.sin(angle + 2 * Math.PI / 3)),
        vec2(A * Math.cos(angle - 2 * Math.PI / 3), A * Math.sin(angle - 2 * Math.PI / 3)),
    ];
    tr = new Drawable('Triangle')
        .initializeShaders(gl, "/vshader1.glsl", "/fshader.glsl")
        .initializePositionBuffer(vertexPositions)
        .initializeColorBuffer(vertexColors)
        .initializeModelMatrix(center[0], center[1], 1, 0)
}

const buildCircle = (numTriangles, center, r) => {
    let vertexColors = [];
    let vertexPositions = [];
    for (let i = 0; i < numTriangles; i++) {
        vertexPositions.push(
            vec2(
                r * Math.cos(i * 2 * Math.PI / numTriangles),
                r * Math.sin(i * 2 * Math.PI / numTriangles),
            )
        );
        vertexColors.push(
            vec4(
                Math.abs(2 * i / numTriangles - 1), 0, 0, 1
            )
        );
    }
    ci = new Drawable('Circle')
        .initializeShaders(gl, "/vshader1.glsl", "/fshader.glsl")
        .initializePositionBuffer(vertexPositions)
        .initializeColorBuffer(vertexColors)
        .initializeModelMatrix(center[0], center[1], 1, 0)
}

const buildEllipse = (numTriangles, center, r) => {
    let vertexPositions = [];
    for (let i = 0; i < numTriangles; i++) {
        vertexPositions.push(
            vec2(
                r * Math.cos(i * 2 * Math.PI / numTriangles),
                0.6 * r * Math.sin(i * 2 * Math.PI / numTriangles),
            )
        );
    }
    el = new Drawable('Ellipse')
        .initializeShaders(gl, "/vshader.glsl", "/fshader.glsl")
        .initializePositionBuffer(vertexPositions)
        .initializeUniformColor(RED)
        .initializeModelMatrix(center[0], center[1], 1, 0)
}

const buildPentagon = (center, r) => {
    // Formula for a regular pentagon obtained courtesy of Wolfram Mathworld
    // https://mathworld.wolfram.com/RegularPentagon.html
    let c1 = 1 / 4 * (Math.sqrt(5) - 1);
    let c2 = 1 / 4 * (Math.sqrt(5) + 1);
    let s1 = 1 / 4 * (Math.sqrt(10 + 2 * Math.sqrt(5)));
    let s2 = 1 / 4 * (Math.sqrt(10 - 2 * Math.sqrt(5)));
    let vertexPositions = [
        vec2(1 * r, 0),
        vec2(c1 * r, s1 * r),
        vec2(-c2 * r, s2 * r),
        vec2(-c2 * r, -s2 * r),
        vec2(c1 * r, -s1 * r),
    ];

    pg = new Drawable('Pentagon')
        .initializeShaders(gl, "/vshader.glsl", "/fshader.glsl")
        .initializePositionBuffer(vertexPositions)
        .initializeUniformColor(GREEN)
        .initializeModelMatrix(center[0], center[1], 1, 0);

}



