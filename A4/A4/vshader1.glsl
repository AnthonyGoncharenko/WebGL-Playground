#version 300 es
in vec2 aPosition;
in vec4 aColor;
out vec4 vColor;
uniform mat3 uModelMatrix;

void main()
{
    vec3 tempLoc = uModelMatrix * vec3(aPosition, 1);
    gl_Position = vec4(tempLoc, 1.0);
    vColor = aColor;
}