class Pyramid {
    constructor(cam, vShader, fShader) {
        var vertices = [
            vec3(-1, 0, 1),
            vec3(1, 0, 1),
            vec3(-1, 0, -1),
            vec3(1, 0, -1),
            vec3(0, 1, 0)
        ];

        let vertexColors = [
            RED,
            YELLOW,
            CYAN,
            BLUE,
            MAGENTA,
        ];

        var indices = [
            0, 1, 3,
            0, 3, 2,
            3, 1, 4,
            3, 4, 2,
            0, 2, 4,
            0, 4, 1
        ];

        // Load shaders and initialize attribute buffers
        this.program = initShaders(gl, vShader, fShader);

        // Load the data into the GPU
        this.vID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
        this.aPosition = gl.getAttribLocation(this.program, "aPosition");

        this.cID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
        this.aColor = gl.getAttribLocation(this.program, "aColor");

        this.eID = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.eID);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

        // Get the location of the attribute and uniform variables from the shader program.

        this.modelMatrix = mat4();
        this.modelMatrixID = gl.getUniformLocation(this.program, "modelMatrix");

        this.projMatrix = perspective(45, canvas.width / canvas.height, 0.1, 100);
        this.projMatrixID = gl.getUniformLocation(this.program, "projMatrix");

        this.camMatrix = cam.cameraMatrix;
        this.camMatrixID = gl.getUniformLocation(this.program, "camMatrix");

        //frame
        //shader stuff
        this.frameProgram = initShaders( gl, "/vshader3.glsl", "/fshader1.glsl" );
        this.faPosition = gl.getAttribLocation( this.frameProgram, "aPosition" );

        this.fModelMatrix = mat4();
        this.fModelMatrixID = gl.getUniformLocation(this.frameProgram, "modelMatrix");

        this.fProjMatrix = perspective(45, canvas.width / canvas.height, 0.1, 100);
        this.fProjMatrixID = gl.getUniformLocation(this.frameProgram, "projMatrix");
        this.fCamMatrix = cam.cameraMatrix;
        this.fCamMatrixID = gl.getUniformLocation(this.frameProgram, "camMatrix");
    }

    draw() {
        gl.useProgram(this.program);
        
        // point the attributes to the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vID);
        gl.vertexAttribPointer(this.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cID);
        gl.vertexAttribPointer(this.aColor, 4, gl.FLOAT, false, 0, 0);
        
        // set the uniform variables
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.eID);
        gl.uniformMatrix4fv(this.modelMatrixID, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(this.projMatrixID, false, flatten(this.projMatrix));
        gl.uniformMatrix4fv(this.camMatrixID, false, flatten(this.camMatrix));
        
        // enable and draw!
        gl.enableVertexAttribArray(this.aPosition);
        gl.enableVertexAttribArray(this.aColor);
        gl.drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_BYTE, 0);
        gl.disableVertexAttribArray(this.aPosition);
        gl.disableVertexAttribArray(this.aColor);

        //Draw the cube frame
        gl.useProgram( this.frameProgram );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vID);
        gl.vertexAttribPointer(this.faPosition, 3, gl.FLOAT, false, 0, 0 );
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.fID);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.eID);
        gl.uniformMatrix4fv(this.fModelMatrixID, false, flatten(this.fModelMatrix));
        gl.uniformMatrix4fv(this.fProjMatrixID, false, flatten(this.fProjMatrix));
        gl.uniformMatrix4fv(this.fCamMatrixID, false, flatten(this.fCamMatrix));

        gl.enableVertexAttribArray(this.faPosition);
        gl.drawElements(gl.LINES, 18, gl.UNSIGNED_BYTE, 0);
        gl.disableVertexAttribArray(this.faPosition );
    }
}
