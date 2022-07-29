class Drawable {
    constructor(name) {
        this.name = name;
        this.shaderProgram = -1;
        this.aPosition = -1;
        this.aColor = -1;
        this.uModelMatrix = -1;

        this.vertexPositions = []
        this.vertexColors = [];
        this.positionBuffer = -1;
        this.colorBuffer = -1;
        this.color = -1;
        this.uColor = -1;
    }
    setModelMatrix(mm) {
        this.modelMatrix = mm;
    }

    getModelMatrix() {
        return this.modelMatrix;
    }
    initializeShaders(gl, vshader, fshader) {
        this.shaderProgram = initShaders(gl, vshader, fshader);
        return this;
    }
    initializeModelMatrix(tx, ty, scale, rotation) {
        this.tx = tx;
        this.ty = ty;
        this.scale = scale;
        this.modelRotation = rotation;

        let t = mat3(1, 0, this.tx, 0, 1, this.ty, 0, 0, 1);
        let s = mat3(this.scale, 0, 0, 0, this.scale, 0, 0, 0, 1);

        let rad = radians(this.modelRotation);
        let r = mat3(Math.cos(rad), -Math.sin(rad), 0, Math.sin(rad), Math.cos(rad), 0, 0, 0, 1);

        this.modelMatrix = mult(t, mult(s, r));
        this.uModelMatrix = gl.getUniformLocation(this.shaderProgram, "uModelMatrix");
        return this;
    }
    initializeColorBuffer(vertexColors) {
        this.vertexColors = vertexColors;

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
        this.aColor = gl.getAttribLocation(this.shaderProgram, "aColor");
        return this;
    }
    initializePositionBuffer(vertexPositions) {
        this.vertexPositions = vertexPositions;

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertexPositions), gl.STATIC_DRAW);
        this.aPosition = gl.getAttribLocation(this.shaderProgram, "aPosition");
        return this;
    }
    initializeUniformColor(color) {
        this.uColor = gl.getUniformLocation(this.shaderProgram, "uColor");
        this.color = color;
        return this;
    }
    useProgram() {
        gl.useProgram(this.shaderProgram);
        return this;
    }
    bindPositionBuffer() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 0, 0);
        return this;
    }

    bindColorBuffer() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(this.aColor, 4, gl.FLOAT, false, 0, 0);
        return this;
    }

    bindUniformColor() {
        gl.uniform4fv(this.uColor, this.color);
        return this;
    }
    bindModelMatrixUniform() {
        gl.uniformMatrix3fv(this.uModelMatrix, false, flatten(this.getModelMatrix()));
        return this;
    }
    drawAndDestructUniform(drawStyle) {
        gl.enableVertexAttribArray(this.aPosition);
        gl.drawArrays(drawStyle, 0, this.vertexPositions.length);
        gl.disableVertexAttribArray(this.aPosition);

        return null;
    }
    drawAndDestruct(drawStyle) {
        gl.enableVertexAttribArray(this.aPosition);
        gl.enableVertexAttribArray(this.aColor);
        gl.drawArrays(drawStyle, 0, this.vertexPositions.length);
        gl.disableVertexAttribArray(this.aPosition);
        gl.disableVertexAttribArray(this.aColor);

        return null;
    }

    drawUniform(drawStyle) {
        this
            .useProgram()
            .bindPositionBuffer()
            .bindUniformColor()
            .bindModelMatrixUniform()
            .drawAndDestructUniform(drawStyle);
        return null;
    }
    draw(drawStyle) {
        this
            .useProgram()
            .bindPositionBuffer()
            .bindColorBuffer()
            .bindModelMatrixUniform()
            .drawAndDestruct(drawStyle);
        return null;
    }
}