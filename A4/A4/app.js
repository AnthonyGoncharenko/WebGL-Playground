var canvas;
var gl;
var toggle = true;
let TRIANGLE_FAN;

function toggleBoxRotation() {
    toggle = !toggle;
}

window.onload = () => {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    TRIANGLE_FAN = gl.TRIANGLE_FAN;
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    let slider = document.getElementById('slider');
    let slider_text = document.getElementById("slider-text");
    slider_text.textContent = slider.value;
    slider.oninput = () => {
        slider_text.textContent = slider.value;
    }
    // buildPentagon(center = vec2(0.5, 0.5), r = 0.5)
    buildCircle(numTriangles = 256, center = vec2(0.5, 0.8), r = 0.20);
    buildTriangle(center = vec2(0, 0.8), colors = [RED, GREEN, BLUE]);
    buildSquares(center = vec2(0, 0));
    buildEllipse(numTriangles = 256, center = vec2(-0.5, 0.8), r = 0.20);
    render();
};
var sq_angle = 0.0;
var tr_angle = 0.0;
var ci_rad = 0;
var ci_scale = 1;
function render() {
    setTimeout(() => {
        requestAnimationFrame(render);
        let slider = document.getElementById('slider');
        if (toggle) {
            sq_angle = (sq_angle + Number(slider.value) / 12.5) % 360;
            tr_angle = (tr_angle - Number(slider.value) / 12.5) % 360;
        }
        else {
            sq_angle = (sq_angle - Number(slider.value) / 12.5) % 360;
            tr_angle = (tr_angle + Number(slider.value) / 12.5) % 360;
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
        squares.forEach(sq => {
            sq
                .initializeModelMatrix(sq.tx, sq.ty, sq.scale, sq_angle)
                .drawUniform(TRIANGLE_FAN);
        })
        ci_rad = ci_rad + 0.1;
        ci_scale = Math.min(Math.abs(Number(slider.value) / 100 * Math.sin(ci_rad)) + 0.2, 1);
        ci
            .initializeModelMatrix(ci.tx, ci.ty, ci_scale, ci.modelRotation)
            .draw(TRIANGLE_FAN);
        tr
            .initializeModelMatrix(tr.tx, tr.ty, tr.scale, tr_angle)
            .draw(TRIANGLE_FAN);
        el.drawUniform(TRIANGLE_FAN);

    }, 50)
}


