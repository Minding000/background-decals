#version 300 es

uniform float cursorRadius;
uniform float cursorCorners;
uniform vec2 mousePosition;
uniform vec2 resolution;

#define PI radians(180.0)

vec2 scaleToViewport(in vec2 value) {
	return value * 2.0 - 1.0;
}

vec2 centerMousePosition(in vec2 value) {
	value.x -= cursorRadius / resolution.x / 2.0;
	value.y += cursorRadius / resolution.y / 2.0;
	return value;
}

void main() {
	float index = float(gl_VertexID) / float(cursorCorners);
	float angle = index * PI * 2.0;

	vec2 circlePosition = vec2(cos(angle), sin(angle)) * cursorRadius;
	circlePosition = circlePosition / resolution;

	vec2 mousePositionWebGL = mousePosition / resolution;
	vec2 mousePositionWebGLViewport = scaleToViewport(mousePositionWebGL);
	// mouse position y to webgl2 y
	mousePositionWebGLViewport.y *= -1.0;
	mousePositionWebGLViewport = centerMousePosition(mousePositionWebGLViewport);

	vec2 finalPosition = mousePositionWebGLViewport + circlePosition;
	gl_Position = vec4(finalPosition, 0, 1);
}
