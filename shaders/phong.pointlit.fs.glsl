precision mediump float;

uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;
//uniform float alpha; //how transparent an object in the scene is

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec2 vTexcoords;
// note that there is no ligth in the scene. we just check 
//how far a pixel is from the light position then we bring out its color more based on that
void main(void) {
    vec3 fromHereToLight01 = normalize(uLightPosition - vWorldPosition);

    vec3 worldNormal01 = normalize(vWorldNormal);
    //vec3 directionToEye01 = normalize(uCameraPosition - vWorldPosition);
    //vec3 reflection01 = 2.0 * dot(worldNormal01, fromHereToLight01) * worldNormal01 - fromHereToLight01;

    float lambert = max(dot(worldNormal01, fromHereToLight01), 0.0);
    //float reflectionDotEyeDir = max(dot(reflection01, directionToEye01), 0.0);
    //float specularIntensity = pow(reflectionDotEyeDir, 64.0);

    //vec3 ambient = vec3(0.0, 0.0, 0.0);
    vec3 diffuseColor = texture2D(uTexture, vTexcoords).rgb;
    //vec3 specularColor = vec3(0.3, 0.3, 0.3) * specularIntensity;
    //vec3 finalColor = ambient + diffuseColor + specularColor;
    vec3 finalColor = diffuseColor;

    float distanceToLight = length(uLightPosition - vWorldPosition);
    float distanceToLightSqr = distanceToLight * distanceToLight;

    // https://www.desmos.com/calculator/nmnaud1hrw
    float linearFalloff = 0.1;
    float quadraticFallof = 0.01;
    float attenuation = 1.0 / (1.0 + linearFalloff * distanceToLight + quadraticFallof * distanceToLightSqr);
    //lambert just tells the program what sides of the planet should be lit.
    //attenuation contorls how much the the parts of the object is lit.
    finalColor = (finalColor  +lambert)*attenuation;

    gl_FragColor = vec4(finalColor, 1.0);
}
