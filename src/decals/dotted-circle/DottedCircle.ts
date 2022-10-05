import { Color, Layer } from '../../objects';

import vertexShaderCode from './vertex.glsl?raw';
import fragmentShaderCode from './fragment.glsl?raw';
import { Util } from '../../util';

export class DottedCircle extends Layer {
	private readonly numberOfDots: number
	private readonly dotRadius: number
	private readonly circleRadius: number
	private readonly color: Color
	private readonly offsetModifier: 1 | -1

	public constructor(
		configurationOverwrites?: Partial<DottedCircleConfiguration>
	) {
		super()
		const configuration = { ...defaultConfiguration, ...configurationOverwrites }
		this.numberOfDots = configuration.numberOfDots
		this.dotRadius = configuration.dotRadius
		this.circleRadius = configuration.circleRadius
		this.color = configuration.color
		this.offsetModifier = configuration.rotationDirection === "clockwise" ? -1 : 1
	}

	public setUp(context: WebGL2RenderingContext): void {
		this.setUpProgram(context, vertexShaderCode, fragmentShaderCode)
		this.program?.setUniform("resolution", context.canvas.width, context.canvas.height)
		this.program?.setColor("color", this.color)
		this.program?.setUniform("numberOfDots", this.numberOfDots)
		this.program?.setUniform("dotRadius", this.dotRadius)
		this.program?.setUniform("circleRadius", this.circleRadius)
	}

	public render(): void {
		let offset = (Date.now() % Util.MILLISECONDS_PER_SECOND) / Util.MILLISECONDS_PER_SECOND
		offset *= this.offsetModifier
		this.program?.use()
		this.program?.setUniform("offset", offset)
		this.context?.drawArrays(this.context.POINTS, 0, this.numberOfDots);
	}
}

export interface DottedCircleConfiguration {
	numberOfDots: number
	dotRadius: number
	circleRadius: number
	color: Color
	rotationDirection: "clockwise" | "counter-clockwise"
}

const defaultConfiguration: DottedCircleConfiguration = {
	numberOfDots: 100,
	dotRadius: 5,
	circleRadius: 0.8,
	color: Color.DEFAULT,
	rotationDirection: "clockwise"
}
