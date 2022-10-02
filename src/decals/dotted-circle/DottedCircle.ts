import { Program, Layer, Color, Shader } from '../../objects';

import vertexShaderCode from './vertex.glsl?raw';
import fragmentShaderCode from './fragment.glsl?raw';

export class DottedCircle extends Layer {

	public constructor(
		private readonly numberOfDots: number,
		private readonly radius: number,
		private readonly color: Color
	) {
		super()
	}

	public setUp(context: WebGL2RenderingContext): void {
		this.context = context
		const vertexShader = new Shader(vertexShaderCode, "vertex")
		const fragmentShader = new Shader(fragmentShaderCode, "fragment")
		this.program = new Program(context,[vertexShader, fragmentShader])
		this.program.use()
		this.program.setUniform("1i", "numberOfDots", this.numberOfDots)
		this.program.setUniform("1f", "radius", this.radius)
		this.program.setColor("color", this.color)
		this.program.setUniform("2f", "resolution", context.canvas.width, context.canvas.height)
	}

	public render(): void {
		this.program.use()
		const offset = (Date.now() % 1000) / 1000
		this.program.setUniform("1f", "offset", offset)
		this.context.drawArrays(this.context.POINTS, 0, this.numberOfDots);
	}
}
