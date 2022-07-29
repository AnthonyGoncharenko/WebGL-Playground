var canvas;
var gl;

var sq;
var pg;

const RED = vec4(1.0,0.0,0.0,1.0)
const GREEN = vec4(0.0,1.0,0.0,1.0);
const BLUE = vec4(0.0,0.0,1.0,1.0);

window.onload = function init(){
    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    sq = new Square2D();
    pg = new Pentagon2D();
    render();
};

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT );
    pg.draw();
    sq.draw();
}


