import { Color, Layer } from '../../objects';

import vertexShaderCode from './vertex.glsl?raw';
import fragmentShaderCode from './fragment.glsl?raw';

export class DottedCircle extends Layer {
	private readonly numberOfDots: number
	private readonly radius: number
	private readonly color: Color

	public constructor(
		configurationOverwrites?: Partial<DottedCircleConfiguration>
	) {
		super()
		const configuration = { ...defaultConfiguration, ...configurationOverwrites }
		this.numberOfDots = configuration.numberOfDots
		this.radius = configuration.radius
		this.color = configuration.color
	}

	public setUp(context: WebGL2RenderingContext): void {
		this.setUpProgram(context, vertexShaderCode, fragmentShaderCode)
		this.program.setUniform("2f", "resolution", context.canvas.width, context.canvas.height)
		this.program.setColor("color", this.color)
		this.program.setUniform("1i", "numberOfDots", this.numberOfDots)
		this.program.setUniform("1f", "radius", this.radius)
	}

	public render(): void {
		const offset = (Date.now() % 1000) / 1000
		this.program.use()
		this.program.setUniform("1f", "offset", offset)
		this.context.drawArrays(this.context.POINTS, 0, this.numberOfDots);
	}
}

export interface DottedCircleConfiguration {
	numberOfDots: number
	radius: number
	color: Color
}

const defaultConfiguration: DottedCircleConfiguration = {
	numberOfDots: 100,
	radius: 0.8,
	color: Color.DEFAULT
}
