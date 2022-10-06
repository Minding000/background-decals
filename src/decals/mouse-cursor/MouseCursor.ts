import { Color, Layer } from '../../objects';

import vertexShaderCode from './vertex.glsl?raw';
import fragmentShaderCode from './fragment.glsl?raw';
import { MousePosition } from '../../util';

export class MouseCursor extends Layer {
	private readonly cursorRadius: number
	private readonly cursorCorners: number
	private readonly cursorLineWidth: number
	private readonly color: Color
	private readonly position: MousePosition

	public constructor(
		configurationOverwrites?: Partial<MouseCursorConfiguration>
	) {
		super()
		const configuration = { ...defaultConfiguration, ...configurationOverwrites }
		this.cursorRadius = configuration.cursorRadius
		this.cursorCorners = configuration.cursorCorners
		this.cursorLineWidth = configuration.cursorLineWidth
		this.color = configuration.color
		this.position = configuration.position
	}

	public setUp(context: WebGL2RenderingContext): void {
		this.setUpProgram(context, vertexShaderCode, fragmentShaderCode)
		context.lineWidth(this.cursorLineWidth)
		this.program?.setColor("color", this.color)
		this.program?.setUniform("cursorRadius", this.cursorRadius)
		this.program?.setUniform("cursorCorners", this.cursorCorners)
		this.program?.setUniform("resolution", context.canvas.width, context.canvas.height)
	}

	public render(): void {
		this.program?.use()
		this.program?.setUniform("mousePosition", this.position.x, this.position.y)
		this.context?.drawArrays(this.context.LINE_LOOP, 0, this.cursorCorners);
	}
}

export interface MouseCursorConfiguration {
	cursorRadius: number
	cursorCorners: number
	cursorLineWidth: number
	color: Color
	position: MousePosition
}

const defaultConfiguration: MouseCursorConfiguration = {
	cursorRadius: 32,
	cursorCorners: 4,
	cursorLineWidth: 2,
	color: Color.DEFAULT,
	position: new MousePosition(window)
}
