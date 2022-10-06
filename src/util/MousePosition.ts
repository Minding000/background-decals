export class MousePosition {
	public x: number = -1
	public y: number = -1

	constructor(listenElement: HTMLCanvasElement|Window) {
		listenElement.addEventListener('mousemove', this.onMouseMove.bind(this))
	}

	onMouseMove(event: MouseEvent) {
		this.x = event.clientX
		this.y = event.clientY
	}
}
