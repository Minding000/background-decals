import { Layer, Shader } from '../../util';

import vertexShaderCode from './vertex.glsl?raw';
import fragmentShaderCode from './fragment.glsl?raw';

export class DottedCircle {
	private layer: Layer

	public constructor(
		private numberOfDots: number
	) {}

	public setup(context: WebGL2RenderingContext): void {
		const vertexShader = new Shader(vertexShaderCode, "vertex")
		const fragmentShader = new Shader(fragmentShaderCode, "fragment")
		this.layer = new Layer(context,[vertexShader, fragmentShader])
		this.layer.setUniform("1i", "numberOfDots", this.numberOfDots)
		this.layer.setUniform("2f", "resolution", context.canvas.width, context.canvas.height)
	}

	public start(context: WebGL2RenderingContext): void {
		setInterval(() => {
			const offset = (Date.now() % 1000) / 1000
			this.layer.setUniform("1f", "offset", offset)
			this.render(context)
		}, 10)
	}

	private render(context: WebGL2RenderingContext): void {
		context.drawArrays(context.POINTS, 0, this.numberOfDots);
	}
}
