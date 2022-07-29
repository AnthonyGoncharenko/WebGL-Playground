var canvas;
var gl;
var TRIANGLE_FAN;
var TRIANGLES;
var interpolated;
var cam;

var vshader0 = "/vshader.glsl";
var vshader1 = "/vshader1.glsl";
var vshader2 = "/vshader2.glsl";
var vshader3 = "/vshader3.glsl";

var fshader0 = "/fshader.glsl";
var fshader1 = "/fshader1.glsl";
var fshader2 = "/fshader2.glsl";

window.onload = () => {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    TRIANGLE_FAN = gl.TRIANGLE_FAN;
    TRIANGLES = gl.TRIANGLES;
    LINES = gl.LINES;
    interpolated = true;

    if (!gl) { alert("WebGL 2.0 isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
    // gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    root2 = Math.sqrt(2);
    cam = new Camera(vrp = vec3(0, 5, 5),
        u = vec3(1, 0, 0),
        v = vec3(0, root2 / 2, -root2 / 2),
        n = vec3(0, root2 / 2, root2 / 2));

    buildSquare();
    py = new Pyramid(cam, vshader1, fshader1)
    buildPyramid(vshader1, fshader1);
    render();
};

function render() {
    setTimeout(() => {
        requestAnimationFrame(render);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        sq.drawUniform(3, TRIANGLES);
        // py.draw();
        py.drawPyramid(3, TRIANGLES);
        pyr.drawWireFrame(3, LINES);
    }, 100)
}


document.addEventListener('keyup', event => {
    // console.log(event.code)
    switch (event.code) {
        case 'KeyW':
            cam.zoomIn(1);
            break;
        case 'KeyA':
            cam.moveHorizontally(1);
            break;
        case 'KeyS':
            cam.zoomIn(-1);
            break;
        case 'KeyD':
            cam.moveHorizontally(-1);
            break;
        case 'Space':
            interpolated = !interpolated;
            // console.log("interpolated: " + interpolated)
            let vshader = (interpolated) ? vshader1 : vshader2;
            let fshader = (interpolated) ? fshader1 : fshader2;
            // py = new Pyramid(cam, vshader, fshader);
            buildPyramid(vshader, fshader);
            break;
    }
});