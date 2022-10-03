import { Layer } from './Layer';

export class Decal {
	private readonly canvas: HTMLCanvasElement
	private readonly context: WebGL2RenderingContext
	private isAnimating: boolean = false
	private lastPerformanceNow = 0

	public constructor(
		private readonly layers: Layer[],
		private maxFps: number
	) {
		this.canvas = document.createElement('canvas')
		this.canvas.width = 800
		this.canvas.height = 600
		this.maxFps = this.maxFps || 120
		this.context = this.canvas.getContext("webgl2")
		this.context.viewport(0, 0, this.canvas.width, this.canvas.height);

		for(const layer of this.layers)
			layer.setUp(this.context)
	}

	public getElement(): HTMLCanvasElement {
		return this.canvas
	}

	public start(): void {
		this.isAnimating = true
		requestAnimationFrame(() => this.render())
	}

	private render(): void {
		if (!this.isAnimating)
			return

		requestAnimationFrame(() => this.render())

		if(!this.fpsCapElapsed())
			return

		this.renderLayers()

		this.lastPerformanceNow = performance.now()
	}

	private fpsCapElapsed(): boolean {
		const msElapsed = performance.now() - this.lastPerformanceNow
		return msElapsed > 1000 / this.maxFps
	}

	private renderLayers(): void {
		for(const layer of this.layers)
			layer.render()
	}

	public stop(): void {
		this.isAnimating = false
	}
}
