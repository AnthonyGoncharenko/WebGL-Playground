class Frame {
    pyr = -1;
    constructor() {
        let indices = [
            0, 1, 3,
            0, 3, 2,
            3, 1, 4,
            3, 4, 2,
            0, 2, 4,
            0, 4, 1
        ];
        let vertexPositions = [
            vec3(-1, 0, 1),
            vec3(1, 0, 1),
            vec3(-1, 0, -1),
            vec3(1, 0, -1),
            vec3(0, 1, 0)
        ];
        this.pyr = new Drawable('PyramidFrame')
            .initializeShaders(gl, "vshader3.glsl", "fshader1.glsl")
            .initializeWireFrameBuffer(indices)
            .initializeModelMatrix3D(tx = 0, ty = 0, tz = 0, sx = 1, sy = 1, sz = 1, rotX = 0, rotY = 0, rotZ = 0)
            .initializeCameraMatrix()
            .initializeProjectionMatrix();
        this.pyr.vertexPositions = vertexPositions;
    }
    draw() {

        this.pyr
            .useProgram()
            .bindElementArrayBuffer()
            .bindModelMatrixUniform()
            .bindProjectionMatrix()
            .bindUniformCameraMatrix()
            .drawAndDestructElements(LINES)

        // gl.useProgram(this.pyr.shaderProgram);
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.pyr.vertexPositions);
        // gl.vertexAttribPointer(this.aPosition, 3, gl.FLOAT, false, 0, 0);

        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.pyr.elementArrayBuffer);
        // gl.uniformMatrix4fv(this.pyr.uModelMatrix, false, flatten(this.pyr.modelMatrix));
        // gl.uniformMatrix4fv(this.pyr.uProjMatrix, false, flatten(this.pyr.projMatrix));
        // gl.uniformMatrix4fv(this.pyr.uCameraMatrix, false, flatten(this.pyr.cameraMatrix));

        // gl.enableVertexAttribArray(this.pyr.aPosition);
        // gl.drawElements(gl.LINES, 18, gl.UNSIGNED_BYTE, 0);
        // gl.disableVertexAttribArray(this.pyr.aPosition);
    }

}



