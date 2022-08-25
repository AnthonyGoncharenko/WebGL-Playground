#version 300 es
in vec4 aPosition;
out vec4 color;
in vec3 aNormal;
in vec4 aColor;
uniform mat4 modelMatrix;
uniform mat4 camMatrix;
uniform mat4 projMatrix;

uniform vec4 matAmbient, matDiffuse, matSpecular;
uniform float matAlpha;

uniform vec4 lightAmbient1, lightDiffuse1, lightSpecular1, lightPos1, lightDir1;
uniform vec4 lightAmbient2, lightDiffuse2, lightSpecular2, lightPos2, lightDir2;

uniform bool lightOn1, lightOn2;

uniform float lightAlpha1, lightAlpha2, lightCutoffAngle1, lightCutoffAngle2;

void main() {
    //compute vectors
    //the vertex in camera coordinates
    vec3 pos = (camMatrix * modelMatrix * aPosition).xyz;
    vec3 lightPosInCam1 = (camMatrix * lightPos1).xyz;
    vec3 lightPosInCam2 = (camMatrix * lightPos2).xyz;
    //the ray from the vertex towards the light
    vec3 fL1 = normalize(lightPosInCam1.xyz - pos);
    vec3 fL2 = normalize(lightPosInCam2.xyz - pos);
    //the ray from the vertex towards the camera
    vec3 fE = normalize(vec3(0, 0, 0) - pos);
    //normal in camera coordinates
    vec3 fN = normalize(camMatrix * modelMatrix * vec4(aNormal, 0)).xyz;
    vec3 fLS1 = normalize((lightDir1).xyz);
    vec3 fLS2 = normalize((camMatrix * lightDir2).xyz);
    //half-way vector
    vec3 H1 = normalize(fL1 + fE);
    vec3 H2 = normalize(fL2 + fE);
    //compute colors
    vec4 ambient1 = lightAmbient1 * matAmbient;
    vec4 ambient2 = lightAmbient2 * matAmbient;
    float Kd1 = max(dot(fL1, fN), 0.0);
    float Kd2 = max(dot(fL2, fN), 0.0);
    vec4 diffuse1 = Kd1 * lightDiffuse1 * matDiffuse;
    vec4 diffuse2 = Kd2 * lightDiffuse2 * matDiffuse;
    float Ks1 = pow(max(dot(fN, H1), 0.0), matAlpha);
    float Ks2 = pow(max(dot(fN, H2), 0.0), matAlpha);
    vec4 specular1 = Ks1 * lightSpecular1 * matSpecular;
    vec4 specular2 = Ks2 * lightSpecular2 * matSpecular;
    if(dot(fL1, fN) < 0.0) 
        specular1 = vec4(0, 0, 0, 1);
    if(dot(fL2, fN) < 0.0) 
        specular2 = vec4(0, 0, 0, 1);
    // sun
    float adjust1;
    adjust1 = 1.0;
    //spotlight
    float adjust2;
    if (!lightOn2){
            adjust2 = 0.0;
    }
    else if (acos(dot(-fL2, fLS2)) > lightCutoffAngle2) {
        adjust2 = 0.0;
    } else {
        float cspot2 = pow(max(dot(-fL1, fLS1), 0.0), lightAlpha1);
        float dropoff2 = 1.0 / max(dot(pos - lightPosInCam2, pos - lightPosInCam2), 0.00001);
        adjust2 = cspot2 * dropoff2;
    }
    color = adjust1 * (ambient1 + diffuse1 + specular1) + adjust2 * (ambient2 + diffuse2 + specular2);
    color.a = 1.0;
    gl_Position = projMatrix * camMatrix * modelMatrix * aPosition;
}