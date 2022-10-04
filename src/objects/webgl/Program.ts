import { Shader, Uniform } from './Shader';
import { WebGlError } from '../index';
import { Color } from './Color';

export class Program {
	public readonly program: WebGLProgram
	public readonly uniforms = new Map<string, Uniform>()

	public constructor(
		public readonly context: WebGL2RenderingContext,
		shaders: Shader[]
	) {
		this.program = this.createProgram()
		const webGlShaders = shaders.map(shader => shader.getWebGlShader(context))
		for(const shader of webGlShaders)
			context.attachShader(this.program, shader)
		context.linkProgram(this.program)
		this.validate()
		for(const shader of shaders)
			for(const uniform of shader.getUniforms(this))
				this.uniforms.set(uniform.name, uniform)
		for(const shader of webGlShaders) {
			context.detachShader(this.program, shader)
			context.deleteShader(shader)
		}
	}

	private createProgram(): WebGLProgram {
		const program = this.context.createProgram()
		if(!program)
			throw new Error("Failed to create WebGL2 program.")
		return program
	}

	public use(): void {
		this.context.useProgram(this.program)
	}

	public setUniform(name: string, ...values: number[]): void {
		const uniform = this.uniforms.get(name)
		if(!uniform)
			throw new Error(`Failed to set value(s) of uniform '${name}': Not found.`)
		uniform.setValues(...values)
	}

	public setColor(name: string, color: Color): void {
		this.setUniform(name, ...color.getWebGlValues())
	}

	private validate(): void {
		if(!this.context.getProgramParameter(this.program, this.context.LINK_STATUS))
			throw new WebGlError("Failed to create program", this.context.getProgramInfoLog(this.program))
		this.context.validateProgram(this.program);
		if(!this.context.getProgramParameter(this.program, this.context.VALIDATE_STATUS))
			throw new WebGlError("Failed to validate program", this.context.getProgramInfoLog(this.program))
	}
}
