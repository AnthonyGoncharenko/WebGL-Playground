// TODO :: Fix the square so that there is an alternating pattern of black and white of squares stacked on top of one another.
class Square2D{
	static center = vec2(0, 0);
    static shaderProgram = -1;
    static uColor = -1;
	
    positionBuffer = -1;
    vertexPositions = [];

    initialize(vertices) {
    	Square2D.shaderProgram = initShaders( gl, "/vshader.glsl", "/fshader.glsl");
    	
		this.vertexPositions = vertices;
		// Load the data into the GPU
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertexPositions), gl.STATIC_DRAW );
			
		// Associate our shader variables with our data buffer
		Square2D.aPosition = gl.getAttribLocation( Square2D.shaderProgram, "aPosition" );
		Square2D.uColor = gl.getUniformLocation( Square2D.shaderProgram, "uColor" );
    }
    	
    constructor(vertices){
		this.initialize(vertices)
	}
    draw(color) {
		
        gl.useProgram(Square2D.shaderProgram);
        
        gl.bindBuffer( gl.ARRAY_BUFFER, this.positionBuffer);
       	gl.vertexAttribPointer(Square2D.aPosition, 2, gl.FLOAT, false, 0, 0 );
       	//  console.log(this.vertexPositions);
		//  console.log(color);
		gl.uniform4fv(Square2D.uColor, color);

		gl.enableVertexAttribArray(Square2D.aPosition);    
    	gl.drawArrays( gl.TRIANGLE_FAN, 0, this.vertexPositions.length);
    	gl.disableVertexAttribArray(Square2D.aPosition);    
    }
}

