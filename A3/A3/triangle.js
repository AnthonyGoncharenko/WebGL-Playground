// TODO :: Fix the color to have a rainbow color gradient.
class Triangle2D{
    static center = vec2(0, 2/3);
    static vertexPositions = [
        vec2(0 + Triangle2D.center[0], 1/3 + Triangle2D.center[1]),
        vec2(1/6 + Triangle2D.center[0], 0 + Triangle2D.center[1]),
        vec2(-1/6 + Triangle2D.center[0], 0 + Triangle2D.center[1]),
    ];
    static vertexColors = [
        RED,
        GREEN,
        BLUE,
    ]
    static positionBuffer = -1;
    static colorBuffer = -1;

    static shaderProgram = -1;
    static aPosition = -1;
    static aColorShader = -1;

    static initialize() {
        
        //body
    	Triangle2D.shaderProgram = initShaders( gl, "/vshader1.glsl", "/fshader.glsl");
        // Load the data into the GPU
		Triangle2D.positionBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, Triangle2D.positionBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(Triangle2D.vertexPositions), gl.STATIC_DRAW );
        
        Triangle2D.colorBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, Triangle2D.colorBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(Triangle2D.vertexColors), gl.STATIC_DRAW );
        
		Triangle2D.aPosition = gl.getAttribLocation( Triangle2D.shaderProgram, "aPosition" );
        Triangle2D.aColor = gl.getAttribLocation(Triangle2D.shaderProgram, "aColor");
        
    }
    	
    constructor(){
        if(Triangle2D.shaderProgram == -1)
		Triangle2D.initialize()
    }

    draw() {
        
        gl.useProgram(Triangle2D.shaderProgram);
        
        gl.bindBuffer( gl.ARRAY_BUFFER, Triangle2D.positionBuffer);
       	gl.vertexAttribPointer(Triangle2D.aPosition, 2, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ARRAY_BUFFER, Triangle2D.colorBuffer);
       	gl.vertexAttribPointer(Triangle2D.aColor, 4, gl.FLOAT, false, 0, 0 );
       	
		gl.enableVertexAttribArray(Triangle2D.aPosition);    
		gl.enableVertexAttribArray(Triangle2D.aColor);    
    	gl.drawArrays( gl.TRIANGLES, 0, Triangle2D.vertexPositions.length );
    	gl.disableVertexAttribArray(Triangle2D.aPosition);    
    	gl.disableVertexAttribArray(Triangle2D.aColor);    
    }
}

