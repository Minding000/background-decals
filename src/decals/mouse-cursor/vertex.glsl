#version 300 es

uniform float dotSize;
uniform vec2 mousePosition;
uniform vec2 resolution;

vec2 scaleToViewport(in vec2 value) {
	return value * 2.0 - 1.0;
}

vec2 centerDot(in vec2 value) {
	return value - dotSize / resolution / 2.0;
}

void main() {
	vec2 mousePositionWebGL = mousePosition / resolution;
	vec2 mousePositionWebGLViewport = scaleToViewport(mousePositionWebGL);
	mousePositionWebGLViewport = centerDot(mousePositionWebGLViewport);
	// mouse position y to webgl2 y
	mousePositionWebGLViewport.y *= -1.0;

	gl_Position = vec4(mousePositionWebGLViewport, 0, 1);
	gl_PointSize = dotSize;
}
