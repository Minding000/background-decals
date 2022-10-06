#version 300 es
uniform float offset;
uniform int numberOfDots;
uniform float dotRadius;
uniform float circleRadius;
uniform vec2 resolution;

#define PI radians(180.0)

void main() {
	float index = (float(gl_VertexID) + offset) / float(numberOfDots);
	float angle = index * PI * 2.0;

	vec2 position = vec2(cos(angle), sin(angle)) * circleRadius;

	float aspect = resolution.y / resolution.x;
	vec2 scale = vec2(aspect, 1);

	gl_Position = vec4(position * scale, 0, 1);
	gl_PointSize = dotRadius;
}
