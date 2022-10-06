#version 300 es
precision highp float;

in vec2 vPosition;

out vec4 outColor;

uniform vec4 color;

float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio

float gold_noise(in vec2 xy, in float seed){
       return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
}

void main() {
	float opacity = gold_noise(gl_FragCoord.xy, 1.0);
	outColor = vec4(color.xyz, opacity);
}
