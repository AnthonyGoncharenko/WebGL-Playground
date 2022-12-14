class Sphere {
    constructor(cam, subdivs, vShader, fShader) {
        //(4 triangular faces per tetrahedron)^(numDivisions+1)*3 vertices per triangle
        this.numVertices = 4 ** (subdivs + 1) * 3;
        this.vPositions = [];
        this.vNormals = [];
        this.vColors = [];
        this.build(subdivs) //populates vPositions and vColors
        this.assignGouradNormals();
        // Load shaders and initialize attribute buffers
        this.program = initShaders(gl, vShader, fShader);
        gl.useProgram(this.program);

        // Load the data into the GPU
        this.vID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vPositions), gl.STATIC_DRAW);

        this.cID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vColors), gl.STATIC_DRAW);

        this.nID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vNormals), gl.STATIC_DRAW);

        // Get the location of the attribute and uniform variables from the shader program.
        this.aColor = gl.getAttribLocation(this.program, "aColor");
        this.aPosition = gl.getAttribLocation(this.program, "aPosition");
        this.aNormal = gl.getAttribLocation(this.program, "aNormal");

        this.modelMatrix = translate(-2, 1, 0);
        this.modelMatrixID = gl.getUniformLocation(this.program, "modelMatrix");

        this.projMatrix = perspective(90, canvas.width / canvas.height, 0.1, 100);
        this.projMatrixID = gl.getUniformLocation(this.program, "projMatrix");

        this.camMatrix = cam.camMatrix;
        this.camMatrixID = gl.getUniformLocation(this.program, "camMatrix");

        this.lightPos1 = gl.getUniformLocation(this.program, "lightPos1");
        this.lightDiff1 = gl.getUniformLocation(this.program, "lightDiffuse1");
        this.lightSpec1 = gl.getUniformLocation(this.program, "lightSpecular1");
        this.lightAmb1 = gl.getUniformLocation(this.program, "lightAmbient1");
        this.lightDir1 = gl.getUniformLocation(this.program, "lightDir1");
        this.lightAlpha1 = gl.getUniformLocation(this.program, "lightAlpha1");

        this.lightPos2 = gl.getUniformLocation(this.program, "lightPos2");
        this.lightDiff2 = gl.getUniformLocation(this.program, "lightDiffuse2");
        this.lightSpec2 = gl.getUniformLocation(this.program, "lightSpecular2");
        this.lightAmb2 = gl.getUniformLocation(this.program, "lightAmbient2");
        this.lightCutOffAng2 = gl.getUniformLocation(this.program, "lightCutoffAngle2")
        this.lightDir2 = gl.getUniformLocation(this.program, "lightDir2");
        this.lightOn2 = gl.getUniformLocation(this.program, "lightOn2");

        // this.lightAlpha2 = gl.getUniformLocation(this.program, "lightAlpha2");

        this.specular = vec4(.6, .6, .6, 1);
        this.diffuse = vec4(.6, .6, .6, 1);
        this.ambient = vec4(1, .5, 0, 1);
        this.shininess = 100;
        this.matSpec = gl.getUniformLocation(this.program, "matSpecular");
        this.matDiff = gl.getUniformLocation(this.program, "matDiffuse");
        this.matAmb = gl.getUniformLocation(this.program, "matAmbient");
        this.matAlpha = gl.getUniformLocation(this.program, "matAlpha");
    }

    assignGouradNormals() {
        var normalSum = [];
        var counts = [];
        for (var i = 0; i < this.numVertices; i++) {
            normalSum.push(vec3(0, 0, 0));
            counts.push(0);
        }
        //for each vertex, find all duplicates and assign the normal to be the average.
        for (var i = 0; i < this.numVertices; i++) {
            var count = 0;
            for (var j = 0; j < this.numVertices; j++) {
                if ((this.vPositions[i][0] == this.vPositions[j][0]) &&
                    (this.vPositions[i][1] == this.vPositions[j][1]) &&
                    (this.vPositions[i][2] == this.vPositions[j][2])) {
                    count++;
                    normalSum[i] = add(normalSum[i], this.vNormals[j]);
                }
            }
            counts[i] = count;
        }
        for (var i = 0; i < this.numVertices; i++) {
            this.vNormals[i] = mult(1.0 / counts[i], normalSum[i]);
        }
    }

    build(subdivs) {
        var sqrt2 = Math.sqrt(2.0);
        var sqrt6 = Math.sqrt(6.0);
        var vertices = [vec3(0, 0, 1),
        vec3(0, 2 * sqrt2 / 3, -1.0 / 3),
        vec3(-sqrt6 / 3.0, -sqrt2 / 3.0, -1.0 / 3),
        vec3(sqrt6 / 3.0, -sqrt2 / 3.0, -1.0 / 3)];
        this.divideTriangle(vertices[0], vertices[1], vertices[2], subdivs);
        this.divideTriangle(vertices[3], vertices[2], vertices[1], subdivs);
        this.divideTriangle(vertices[0], vertices[3], vertices[1], subdivs);
        this.divideTriangle(vertices[0], vertices[2], vertices[3], subdivs);
    }

    divideTriangle(x1, x2, x3, subdivs) {
        if (subdivs > 0) {
            var v1 = normalize(add(x1, x2));
            var v2 = normalize(add(x1, x3));
            var v3 = normalize(add(x2, x3));
            this.divideTriangle(x1, v1, v2, subdivs - 1);
            this.divideTriangle(x3, v2, v3, subdivs - 1);
            this.divideTriangle(x2, v3, v1, subdivs - 1);
            this.divideTriangle(v1, v3, v2, subdivs - 1);
        } else {
            this.triangle(x1, x2, x3);
        }
    }

    triangle(x1, x2, x3) {
        var N = normalize(cross(subtract(x2, x1), subtract(x3, x1)));
        this.vPositions.push(vec4(...x1, 1.0));
        this.vNormals.push(N);
        this.vColors.push(RED);
        this.vPositions.push(vec4(...x2, 1.0));
        this.vNormals.push(N);
        this.vColors.push(GREEN);
        this.vPositions.push(vec4(...x3, 1.0));
        this.vNormals.push(N);
        this.vColors.push(BLUE);
    }

    draw() {
        gl.useProgram(this.program);

        // point the attributes to the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vID);
        gl.vertexAttribPointer(this.aPosition, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cID);
        // gl.vertexAttribPointer(this.aColor, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.nID);
        gl.vertexAttribPointer(this.aNormal, 3, gl.FLOAT, false, 0, 0);

        // set the uniform variables
        gl.uniformMatrix4fv(this.modelMatrixID, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(this.projMatrixID, false, flatten(this.projMatrix));
        gl.uniformMatrix4fv(this.camMatrixID, false, flatten(this.camMatrix));

        //assumes a light object called light
        gl.uniform4fv(this.lightPos1, sun.position);
        gl.uniform4fv(this.lightDiff1, sun.diffuse);
        gl.uniform4fv(this.lightSpec1, sun.specular);
        gl.uniform4fv(this.lightAmb1, sun.ambient);
        gl.uniform4fv(this.lightDir1, sun.direction);
        gl.uniform1f(this.lightAlpha1, sun.alpha);

        gl.uniform4fv(this.lightPos2, flash.position);
        gl.uniform4fv(this.lightDiff2, flash.diffuse);
        gl.uniform4fv(this.lightSpec2, flash.specular);
        gl.uniform4fv(this.lightAmb2, flash.ambient);
        gl.uniform1f(this.lightCutOffAng2, flash.cutoffAngle);
        gl.uniform4fv(this.lightDir2, flash.direction);
        gl.uniform1i(this.lightOn2, flash.on);


        gl.uniform4fv(this.matSpec, this.specular);
        gl.uniform4fv(this.matDiff, this.diffuse);
        gl.uniform4fv(this.matAmb, this.ambient);
        gl.uniform1f(this.matAlpha, this.shininess);

        // enable and draw!
        gl.enableVertexAttribArray(this.aPosition);
        // gl.enableVertexAttribArray(this.aColor);
        gl.enableVertexAttribArray(this.aNormal);
        gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
        gl.disableVertexAttribArray(this.aPosition);
        // gl.disableVertexAttribArray(this.aColor);
        gl.disableVertexAttribArray(this.aNormal);
    }
}
