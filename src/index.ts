export default class Decal {
	private readonly canvas: HTMLCanvasElement
	private readonly context: WebGL2RenderingContext

	constructor() {
		this.canvas = document.createElement('canvas')
		this.canvas.width = 800
		this.canvas.height = 600
		this.context = this.canvas.getContext("webgl2")
	}

	getElement(): HTMLCanvasElement {
		return this.canvas
	}
}
