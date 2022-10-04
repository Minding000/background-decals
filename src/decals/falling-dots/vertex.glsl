#version 300 es
uniform float continuousFloatBetweenZeroAndIterationCount;
uniform int numberOfUniqueIterations;
uniform int numberOfDots;
uniform vec2 resolution;

float noise(in float seed) {
	return fract(tan(seed) * 1000.0);
}

float scaleToViewport(in float value) {
	return value * 2.0 - 1.0;
}

void main() {
	float pointIndex = float(gl_VertexID);
	float invalidIterationNumber = -1.0;
	float randomFloatBeteenZeroAndOne = noise(pointIndex + invalidIterationNumber);
	float globalYPosition = -randomFloatBeteenZeroAndOne - continuousFloatBetweenZeroAndIterationCount;
	float localYPosition = fract(globalYPosition);
	float iterationIndex = -float(int(globalYPosition) % numberOfUniqueIterations);
	float localXPosition = noise(pointIndex + iterationIndex);

	localXPosition = scaleToViewport(localXPosition);
	localYPosition = scaleToViewport(localYPosition);
	gl_Position = vec4(localXPosition, localYPosition, 0, 1);
	gl_PointSize = 5.0;
}
