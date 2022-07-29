
class Ellipse2D{
    static center = vec2(-0.5, 0.8);
    static r = 0.20; 
    static vertexPositions = [];

    static shaderProgram = -1;
    static positionBuffer = -1;
    static aPositionShader = -1;
    static uColor = -1;

    static initialize() {
    	Ellipse2D.shaderProgram = initShaders( gl, "/vshader.glsl", "/fshader.glsl");
        let numTriangles = 256;
        for (let i = 0; i < numTriangles ; i++){
            Ellipse2D.vertexPositions.push(
                vec2(
                    Ellipse2D.r*Math.cos(i*2*Math.PI/numTriangles) + Ellipse2D.center[0], 
                    0.6*Ellipse2D.r*Math.sin(i*2*Math.PI/numTriangles) + Ellipse2D.center[1],
                )
            );
        }
		// Load the data into the GPU
		Ellipse2D.positionBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, Ellipse2D.positionBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(Ellipse2D.vertexPositions), gl.STATIC_DRAW );
			
		// Associate our shader variables with our data buffer
		Ellipse2D.aPositionShader = gl.getAttribLocation( Ellipse2D.shaderProgram, "aPosition" );
	
		Ellipse2D.uColor = gl.getUniformLocation( Ellipse2D.shaderProgram, "uColor" );
    }
    	
    constructor(){
        if(Ellipse2D.shaderProgram == -1)
		Ellipse2D.initialize()
    }

    draw() {
		
        gl.useProgram(Ellipse2D.shaderProgram);
        
        gl.bindBuffer( gl.ARRAY_BUFFER, Ellipse2D.positionBuffer);
       	gl.vertexAttribPointer(Ellipse2D.aPositionShader, 2, gl.FLOAT, false, 0, 0 );
       	
		gl.uniform4fv(Ellipse2D.uColor, RED);
		gl.enableVertexAttribArray(Ellipse2D.aPositionShader);    
	
    	gl.drawArrays( gl.TRIANGLE_FAN, 0, Ellipse2D.vertexPositions.length );
    	gl.disableVertexAttribArray(Ellipse2D.aPositionShader);    
    }
}

