import { Shader } from './Shader';
import { WebGlError } from '..';

export type UniformType = "1i" | "1f" | "2f"

export class Layer {
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
		Layer.validate(context, this.program)
		for(const shader of webGlShaders) {
			context.detachShader(this.program, shader)
			context.deleteShader(shader)
		}
		context.useProgram(this.program)
	}

	public setUniform(type: UniformType, name: string, ...values: number[]): void {
		const location = this.context.getUniformLocation(this.program, name)
		// @ts-ignore - Dynamic amount of parameters,
		// because the possible function take different numbers of parameters
		this.context[`uniform${type}`](location, ...values)
	}

	private static validate(context: WebGL2RenderingContext, program: WebGLProgram): void {
		if(!context.getProgramParameter(program, context.LINK_STATUS))
			throw new WebGlError("Failed to create program", context.getProgramInfoLog(program))
		context.validateProgram(program);
		if(!context.getProgramParameter(program, context.VALIDATE_STATUS))
			throw new WebGlError("Failed to validate program", context.getProgramInfoLog(program))
	}
}
