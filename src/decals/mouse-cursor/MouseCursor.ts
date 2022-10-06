import { Color, Layer } from '../../objects';

import vertexShaderCode from './vertex.glsl?raw';
import fragmentShaderCode from './fragment.glsl?raw';
import { MousePosition } from '../../util';

export class MouseCursor extends Layer {
	private readonly dotSize: number
	private readonly color: Color
	private readonly position: MousePosition

	public constructor(
		configurationOverwrites?: Partial<MouseCursorConfiguration>
	) {
		super()
		const configuration = { ...defaultConfiguration, ...configurationOverwrites }
		this.dotSize = configuration.dotSize
		this.color = configuration.color
		this.position = configuration.position
	}

	public setUp(context: WebGL2RenderingContext): void {
		this.setUpProgram(context, vertexShaderCode, fragmentShaderCode)
		this.program?.setColor("color", this.color)
		this.program?.setUniform("dotSize", this.dotSize)
		this.program?.setUniform("resolution", context.canvas.width, context.canvas.height)
	}

	public render(): void {
		this.program?.use()
		this.program?.setUniform("mousePosition", this.position.x, this.position.y)
		this.context?.drawArrays(this.context.POINTS, 0, 20);
	}
}

export interface MouseCursorConfiguration {
	dotSize: number
	color: Color
	position: MousePosition
}

const defaultConfiguration: MouseCursorConfiguration = {
	dotSize: 20,
	color: Color.DEFAULT,
	position: new MousePosition(window)
}
