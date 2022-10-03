import { Layer } from './Layer';

export class Decal {
	private readonly canvas: HTMLCanvasElement
	private readonly context: WebGL2RenderingContext
	private isRendering: boolean = false
	private lastRenderTimePoint = 0

	public constructor(
		private readonly layers: Layer[],
		targetFrameRate: number = 60
	) {
		this.canvas = document.createElement('canvas')
		this.canvas.width = 800
		this.canvas.height = 600
		this.millisecondsBetweenFrames = 1000 / targetFrameRate
		this.context = this.canvas.getContext("webgl2")
		this.context.viewport(0, 0, this.canvas.width, this.canvas.height);

		for(const layer of this.layers)
			layer.setUp(this.context)
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
