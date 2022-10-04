import { WebGlError } from '../errors';
import { Program } from './Program';
import { Uniform } from './Uniform';

export class Shader {
	private static readonly UNIFORM_REGEX = /^uniform\s+(?<type>\w+)\s+(?<name>\w+);/gm

	public constructor(
		private readonly code: string,
		private readonly type: "vertex" | "fragment"
	) {}

	public getWebGlShader(context: WebGL2RenderingContext): WebGLShader {
		const shader = this.createShader(context)
		context.shaderSource(shader, this.code)
		context.compileShader(shader)
		this.validate(context, shader)
		return shader
	}

	public getUniforms(program: Program): Uniform[] {
		const uniforms: Uniform[] = []
		while(true) {
			const uniform = Shader.UNIFORM_REGEX.exec(this.code)
			if(!uniform)
				break
			const type = uniform?.groups?.["type"]
			if(!type)
				throw new Error("Failed to extract type of uniform.")
			const name = uniform?.groups?.["name"]
			if(!name)
				throw new Error("Failed to extract name of uniform.")
			uniforms.push(new Uniform(program, type, name))
		}
		return uniforms
	}

	private createShader(context: WebGL2RenderingContext): WebGLShader {
		const shader = context.createShader(this.getWebGlType(context))
		if(!shader)
			throw new Error("Failed to create WebGL2 shader.")
		return shader
	}

	private getWebGlType(context: WebGL2RenderingContext): number {
		return this.type === "vertex" ? context.VERTEX_SHADER : context.FRAGMENT_SHADER
	}

	private validate(context: WebGL2RenderingContext, shader: WebGLShader): void {
		if(!context.getShaderParameter(shader, context.COMPILE_STATUS))
			throw new WebGlError("Failed to compile shader", context.getShaderInfoLog(shader))
	}
}
