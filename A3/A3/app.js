var canvas;
var gl;

var pg;
var ci; 
var tr;
var el;
var colors = [];
var squares = [];

const RED = vec4(1.0,0.0,0.0,1.0);
const GREEN = vec4(0.0,1.0,0.0,1.0);
const BLUE = vec4(0.0,0.0,1.0,1.0);
const MAGENTA = vec4(1.0, 0.0, 1.0, 1.0);
const WHITE = vec4(1,1,1,1);
const BLACK = vec4(0,0,0,1);

var buildSquares = () => {
    const center = vec2(0,0);
    for (let i = 6; i >= 1 ; i--){
        var vertices = [
            vec2(-i*.1, -i*.1),
            vec2(-i*.1, i*.1),
            vec2(i*.1, i*.1),
            vec2(i*.1, -i*.1)
        ];
        
        squares.push(new Square2D(vertices));
        colors.push(i%2==0?WHITE:BLACK);
    }
}
window.onload = function init(){
    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    ci = new Circle2D();
    tr = new Triangle2D();
    el = new Ellipse2D();
    buildSquares();
    render();
};

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT );
    for (let i = 0; i < squares.length; i++){
        squares[i].draw(colors[i]);
    }
    ci.draw();
    tr.draw();
    el.draw();
}


