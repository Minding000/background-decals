import { Layer } from './Layer';
import { DecalError } from './errors';
import { Util } from '../util';

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
			this.millisecondsBetweenFrames = Util.MILLISECONDS_PER_SECOND / configuration.targetFrameRate
			this.canvas = this.createCanvas(configuration.width, configuration.height)
			this.context = this.createContext()

			for(const layer of this.layers)
				layer.setUp(this.context)
		} catch(error) {
			throw new DecalError("Failed to create decal", error)
		}
	}

	private createCanvas(width: number, height: number): HTMLCanvasElement {
		const canvas = document.createElement('canvas')
		canvas.width = width
		canvas.height = height
		return canvas
	}

	private createContext(): WebGL2RenderingContext {
		const context = this.canvas.getContext("webgl2")
		if(!context)
			throw new Error("Failed to create WebGL2 context.")
		context.viewport(0, 0, this.canvas.width, this.canvas.height);
		return context
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
