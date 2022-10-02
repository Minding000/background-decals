import { DottedCircle } from './decals/dotted-circle';

export default class Decal {
	private readonly canvas: HTMLCanvasElement
	private readonly context: WebGL2RenderingContext

	public constructor() {
		this.canvas = document.createElement('canvas')
		this.canvas.width = 800
		this.canvas.height = 600
		this.context = this.canvas.getContext("webgl2")
		this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
	}

	public getElement(): HTMLCanvasElement {
		return this.canvas
	}

	public start(): void {
		const dottedCircle = new DottedCircle(12)
		dottedCircle.setup(this.context)
		dottedCircle.start(this.context)
	}
}
