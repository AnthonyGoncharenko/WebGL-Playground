
class Pentagon2D{
    // Formula for a regular pentagon obtained courtesy of Wolfram Mathworld
    // https://mathworld.wolfram.com/RegularPentagon.html
    static vertexPositions = [
        vec2(1/2+0.375,0+0.375),
        vec2(0.309016/2+0.375, 0.951056/2+0.375), 
        vec2(-0.8090169/2+0.375, 0.5877852/2+0.375), 
        vec2(-0.8090169/2+0.375, -0.5877852/2+0.375), 
        vec2(0.309016/2+0.375, -0.951056/2+0.375), 
    ];

    static shaderProgram = -1;
    static positionBuffer = -1;
    static aPositionShader = -1;
    static uColor = -1;
    
    static initialize() {
    	Pentagon2D.shaderProgram = initShaders( gl, "/vshader.glsl", "/fshader.glsl");

        // Load the data into the GPU
        Pentagon2D.positionBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, Pentagon2D.positionBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(Pentagon2D.vertexPositions), gl.STATIC_DRAW );
            
        // Associate our shader variables with our data buffer
        Pentagon2D.aPositionShader = gl.getAttribLocation( Pentagon2D.shaderProgram, "aPosition" );
	
		Pentagon2D.uColor = gl.getUniformLocation( Pentagon2D.shaderProgram, "uColor" );
    }
    	
    constructor(){
        if(Pentagon2D.shaderProgram == -1)
            Pentagon2D.initialize()
    }

    draw() {
        gl.useProgram(Pentagon2D.shaderProgram);
        
        gl.bindBuffer( gl.ARRAY_BUFFER, Pentagon2D.positionBuffer);
       	gl.vertexAttribPointer(Pentagon2D.aPositionShader, 2, gl.FLOAT, false, 0, 0 );
           
        gl.uniform4fv(Pentagon2D.uColor, GREEN);
	    gl.enableVertexAttribArray(Pentagon2D.aPositionShader);    
	
    	gl.drawArrays( gl.TRIANGLE_FAN, 0, 5);
    	gl.disableVertexAttribArray(Pentagon2D.aPositionShader);    
    }
}

