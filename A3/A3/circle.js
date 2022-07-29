//TODO ::  To achieve the red color effect, vary its vertices amount of red as a function of the angle
class Circle2D{
    static center = vec2(0.5, 0.8);
    static r = 0.20; 
    static vertexPositions = [];
    static vertexColors = [];

    static shaderProgram = -1;
    static positionBuffer = -1;
    static colorBuffer = -1;
    static aPositionShader = -1;
    static aColorShader = -1;

    static populateCircle(numTriangles){
        for (let i = 0; i < numTriangles ; i++){
            Circle2D.vertexPositions.push(
                vec2(
                    Circle2D.r*Math.cos(i*2*Math.PI/numTriangles) + Circle2D.center[0], 
                    Circle2D.r*Math.sin(i*2*Math.PI/numTriangles) + Circle2D.center[1],
                )
            );
            Circle2D.vertexColors.push(
                vec4(
                    Math.abs(2*i/numTriangles - 1), 0 , 0 , 1
                )
            );
        }
    }	
    static initialize() {
        Circle2D.shaderProgram = initShaders( gl, "/vshader1.glsl", "/fshader.glsl");
        
        Circle2D.populateCircle(256);
        // Load the data into the GPU
        Circle2D.positionBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, Circle2D.positionBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(Circle2D.vertexPositions), gl.STATIC_DRAW );
        
        Circle2D.colorBuffer = gl.createBuffer(gl.ARRAY_BUFFER, Circle2D.colorBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, Circle2D.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Circle2D.vertexColors), gl.STATIC_DRAW);

        // Associate our shader variables with our data buffer
        Circle2D.aPositionShader = gl.getAttribLocation( Circle2D.shaderProgram, "aPosition" );
        Circle2D.aColorShader = gl.getAttribLocation( Circle2D.shaderProgram, "aColor" );
    
    }
    constructor(){
        if(Circle2D.shaderProgram == -1)
        Circle2D.initialize()
    }
                    
    draw() {
		
        gl.useProgram(Circle2D.shaderProgram);
        
        gl.bindBuffer( gl.ARRAY_BUFFER, Circle2D.positionBuffer);
       	gl.vertexAttribPointer(Circle2D.aPositionShader, 2, gl.FLOAT, false, 0, 0 );

        gl.bindBuffer( gl.ARRAY_BUFFER, Circle2D.colorBuffer);
       	gl.vertexAttribPointer(Circle2D.aColorShader, 4, gl.FLOAT, false, 0, 0 );
       	
        gl.enableVertexAttribArray(Circle2D.aPositionShader);    
		gl.enableVertexAttribArray(Circle2D.aColorShader);    
    	gl.drawArrays( gl.TRIANGLE_FAN, 0, Circle2D.vertexPositions.length );
    	gl.disableVertexAttribArray(Circle2D.aPositionShader);    
    	gl.disableVertexAttribArray(Circle2D.aColorShader);    
    }
}

