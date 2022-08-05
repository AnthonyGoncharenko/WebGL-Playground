class Drawable {
  constructor(name) {
    this.name = name;

    this.shaderProgram = -1;
    this.aPosition = -1;
    this.aColor = -1;
    this.uModelMatrix = -1;
    this.uCameraMatrix = -1;
    this.uProjMatrix = -1;

    this.vertexPositions = [];
    this.vertexColors = [];
    this.positionBuffer = -1;
    this.colorBuffer = -1;
    this.projMatrix = -1;
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
  initializeModelMatrix2D(tx, ty, scale, rotation) {
    this.tx = tx;
    this.ty = ty;
    this.scale = scale;
    this.modelRotation = rotation;

    let t = mat3(1, 0, this.tx, 0, 1, this.ty, 0, 0, 1);
    let s = mat3(this.scale, 0, 0, 0, this.scale, 0, 0, 0, 1);

    let rad = radians(this.modelRotation);
    let r = mat3(
      Math.cos(rad), -Math.sin(rad), 0,
      Math.sin(rad), Math.cos(rad), 0,
      0, 0, 1
    );

    this.modelMatrix = mult(t, mult(s, r));
    console.log(this.modelMatrix);
    this.uModelMatrix = gl.getUniformLocation(this.shaderProgram, "modelMatrix");
    return this;
  }
  initializeModelMatrix3D(tx, ty, tz, sx, sy, sz, rotX, rotY, rotZ) {
    let t = translate(tx, ty, tz);
    let s = scale(sx, sy, sz);
    let rx = rotateX(rotX);
    let ry = rotateY(rotY);
    let rz = rotateZ(rotZ);

    this.modelMatrix = mult(t, mult(s, mult(rz, mult(ry, rx))));
    this.uModelMatrix = gl.getUniformLocation(
      this.shaderProgram,
      "modelMatrix"
    );
    return this;
  }
  initializeCameraMatrix() {
    this.cameraMatrix = cam.cameraMatrix;
    this.uCameraMatrix = gl.getUniformLocation(this.shaderProgram, "camMatrix");
    return this;
  }
  initializeProjectionMatrix(angle, near, far) {
    this.projMatrix = perspective(
      angle,
      canvas.width / canvas.height,
      near,
      far
    );
    this.uProjMatrix = gl.getUniformLocation(this.shaderProgram, "projMatrix");
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
  initializeElementArrayBuffer(indices) {
    this.indices = indices;

    this.elementArrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementArrayBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);
    this.aPosition = gl.getAttribLocation(this.shaderProgram, "aPosition");
    return this;
  }
  initializeUniformColor(color) {
    this.uColor = gl.getUniformLocation(this.shaderProgram, "uColor");
    this.color = color;
    return this;
  }
  setDepthBufferReadOnly() {
    gl.depthMask(false);
    return this;
  }
  enableBlending(source_factor, destination_factor) {
    gl.enable(gl.BLEND);
    gl.blendFunc(source_factor, destination_factor);
    return this;
  }
  setDepthBufferWriteRead() {
    gl.depthMask(true);
    return this;
  }
  disableBlending() {
    gl.disable(gl.BLEND);
    return this;
  }
  useProgram() {
    gl.useProgram(this.shaderProgram);
    return this;
  }
  bindPositionBuffer(dimension) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(this.aPosition, dimension, gl.FLOAT, false, 0, 0);
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
    gl.uniformMatrix4fv(
      this.uModelMatrix,
      false,
      flatten(this.getModelMatrix())
    );
    return this;
  }
  bindUniformCameraMatrix() {
    gl.uniformMatrix4fv(this.uCameraMatrix, false, flatten(cam.cameraMatrix));
    return this;
  }
  bindProjectionMatrix() {
    gl.uniformMatrix4fv(this.uProjMatrix, false, flatten(this.projMatrix));
    return this;
  }
  bindElementArrayBuffer() {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementArrayBuffer);
    return this;
  }
  drawAndDestructUniform(drawStyle) {
    gl.enableVertexAttribArray(this.aPosition);
    gl.drawArrays(drawStyle, 0, this.vertexPositions.length);
    gl.disableVertexAttribArray(this.aPosition);

    return null;
  }
  drawAndDestructWireFrame(drawStyle) {
    gl.enableVertexAttribArray(this.aPosition);
    gl.drawElements(
      drawStyle,
      this.vertexPositions.length,
      gl.UNSIGNED_BYTE,
      0
    );
    gl.disableVertexAttribArray(this.aPosition);
  }
  drawAndDestruct(drawStyle) {
    gl.enableVertexAttribArray(this.aPosition);
    gl.enableVertexAttribArray(this.aColor);
    gl.drawArrays(drawStyle, 0, this.vertexPositions.length);
    gl.disableVertexAttribArray(this.aPosition);
    gl.disableVertexAttribArray(this.aColor);

    return null;
  }
  drawAndDestructElements(drawStyle) {
    gl.enableVertexAttribArray(this.aPosition);
    if (this.aColor != -1) gl.enableVertexAttribArray(this.aColor);
    gl.drawElements(drawStyle, this.indices.length, gl.UNSIGNED_INT, 0);
    if (this.aColor != -1) gl.disableVertexAttribArray(this.aColor);
    gl.disableVertexAttribArray(this.aPosition);

    return null;
  }

  drawWireFrame(drawStyle) {
    this.useProgram()
      .bindElementArrayBuffer()
      .bindModelMatrixUniform()
      .bindProjectionMatrix()
      .bindUniformCameraMatrix()
      .drawAndDestructElements(drawStyle);
  }
}
