import { Shader } from './Shader';
import { WebGlError } from '../index';
import { Color } from './Color';

export type UniformType = "1i" | "1f" | "2f" | "4f"

export class Program {
	private readonly program: WebGLProgram

	public constructor(
		private readonly context: WebGL2RenderingContext,
		shaders: Shader[]
	) {
		this.program = context.createProgram()
		const webGlShaders = shaders.map(shader => shader.getWebGlShader(context))
		for(const shader of webGlShaders)
			context.attachShader(this.program, shader)
		context.linkProgram(this.program)
		this.validate()
		for(const shader of webGlShaders) {
			context.detachShader(this.program, shader)
			context.deleteShader(shader)
		}
	}

	public use(): void {
		this.context.useProgram(this.program)
	}

	public setUniform(type: UniformType, name: string, ...values: number[]): void {
		const location = this.context.getUniformLocation(this.program, name)
		// @ts-ignore - Dynamic amount of parameters,
		// because the possible function take different numbers of parameters
		this.context[`uniform${type}`](location, ...values)
	}

	public setColor(name: string, color: Color): void {
		this.setUniform("4f", name, ...color.getWebGlValues())
	}

	private validate(): void {
		if(!this.context.getProgramParameter(this.program, this.context.LINK_STATUS))
			throw new WebGlError("Failed to create program", this.context.getProgramInfoLog(this.program))
		this.context.validateProgram(this.program);
		if(!this.context.getProgramParameter(this.program, this.context.VALIDATE_STATUS))
			throw new WebGlError("Failed to validate program", this.context.getProgramInfoLog(this.program))
	}
}
