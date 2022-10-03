import { Color, Layer } from '../../objects';

import vertexShaderCode from './vertex.glsl?raw';
import fragmentShaderCode from './fragment.glsl?raw';

export class FallingDots extends Layer {
	private static readonly MILLISECONDS_PER_SECOND = 1000
	public static readonly MAX_NUMBER_OF_UNIQUE_ITERATIONS = 100000
	private readonly numberOfDots: number
	private readonly numberOfUniqueIterations: number
	private readonly iterationDurationInSeconds: number
	private readonly color: Color

	public constructor(
		configurationOverwrites?: Partial<FallingDotsConfiguration>
	) {
		super()
		const configuration = { ...defaultConfiguration, ...configurationOverwrites }
		this.numberOfDots = configuration.numberOfDots
		this.numberOfUniqueIterations = configuration.numberOfUniqueIterations
		this.iterationDurationInSeconds = configuration.iterationDurationInSeconds
		this.color = configuration.color
	}

	public setUp(context: WebGL2RenderingContext): void {
		this.setUpProgram(context, vertexShaderCode, fragmentShaderCode)
		this.program?.setColor("color", this.color)
		this.program?.setUniform("1i", "numberOfDots", this.numberOfDots)
		this.program?.setUniform("1i", "numberOfUniqueIterations", this.numberOfUniqueIterations)
	}

	public render(): void {
		const iterationDurationInMilliseconds = FallingDots.MILLISECONDS_PER_SECOND * this.iterationDurationInSeconds
		const offset = (Date.now() / iterationDurationInMilliseconds) % this.numberOfUniqueIterations
		this.program?.use()
		this.program?.setUniform("1f", "offset", offset)
		this.context?.drawArrays(this.context.POINTS, 0, this.numberOfDots);
	}
}

export interface FallingDotsConfiguration {
	numberOfDots: number
	numberOfUniqueIterations: number
	iterationDurationInSeconds: number
	color: Color
}

const defaultConfiguration: FallingDotsConfiguration = {
	numberOfDots: 100,
	numberOfUniqueIterations: FallingDots.MAX_NUMBER_OF_UNIQUE_ITERATIONS,
	iterationDurationInSeconds: 1,
	color: Color.DEFAULT
}
