#version 300 es
precision highp float;

out vec4 outColor;

uniform vec4 color;

void main() {
	outColor = color;
}
