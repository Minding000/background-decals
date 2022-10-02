import { Layer } from './Layer';

export class Decal {
	private readonly canvas: HTMLCanvasElement
	private readonly context: WebGL2RenderingContext
	private interval: number|null = null

	public constructor(
		private readonly layers: Layer[]
	) {
		this.canvas = document.createElement('canvas')
		this.canvas.width = 800
		this.canvas.height = 600
		this.context = this.canvas.getContext("webgl2")
		this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
		for(const layer of this.layers)
			layer.setUp(this.context)
	}

	public getElement(): HTMLCanvasElement {
		return this.canvas
	}

	public start(): void {
		this.interval = setInterval(() => {
			for(const layer of this.layers)
				layer.render()
		}, 10)
	}

	public stop(): void {
		if(this.interval != null) {
			clearInterval(this.interval)
			this.interval = null
		}
	}
}
