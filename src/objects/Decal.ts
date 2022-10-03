import { Layer } from './Layer';
import { DecalError } from './errors';

export class Decal {
	private readonly canvas: HTMLCanvasElement
	private readonly context: WebGL2RenderingContext
	private isRendering: boolean = false
	private lastRenderTimePoint = 0
	private readonly millisecondsBetweenFrames: number

	public constructor(
		private readonly layers: Layer[],
		configurationOverwrites?: Partial<DecalConfiguration>
	) {
		try {
			const configuration = { ...defaultConfiguration, ...configurationOverwrites }
			this.canvas = document.createElement('canvas')
			this.canvas.width = configuration.width
			this.canvas.height = configuration.height
			this.millisecondsBetweenFrames = 1000 / configuration.targetFrameRate
			this.context = this.canvas.getContext("webgl2")
			this.context.viewport(0, 0, this.canvas.width, this.canvas.height);

			for(const layer of this.layers)
				layer.setUp(this.context)
		} catch(error) {
			throw new DecalError("Failed to create decal", error)
		}
	}

	public getElement(): HTMLCanvasElement {
		return this.canvas
	}

	public start(): void {
		this.isRendering = true
		requestAnimationFrame(this.render.bind(this))
	}

	private render(): void {
		if (!this.isRendering)
			return

		requestAnimationFrame(this.render.bind(this))

		if(!this.shouldRender())
			return

		this.renderLayers()

		this.lastRenderTimePoint = performance.now()
	}

	private shouldRender(): boolean {
		const elapsedTimeInMilliseconds = performance.now() - this.lastRenderTimePoint
		return elapsedTimeInMilliseconds > this.millisecondsBetweenFrames
	}

	private renderLayers(): void {
		for(const layer of this.layers)
			layer.render()
	}

	public stop(): void {
		this.isRendering = false
	}
}

export interface DecalConfiguration {
	targetFrameRate: number,
	width: number,
	height: number
}

const defaultConfiguration: DecalConfiguration = {
	width: 800,
	height: 600,
	targetFrameRate: 60,
}
