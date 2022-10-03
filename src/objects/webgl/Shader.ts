import { WebGlError } from '../errors';

export class Shader {

	public constructor(
		private code: string,
		private type: "vertex" | "fragment"
	) {}

	public getWebGlShader(context: WebGL2RenderingContext): WebGLShader {
		const shader = context.createShader(this.getWebGlType(context))
		context.shaderSource(shader, this.code)
		context.compileShader(shader)
		this.validate(context, shader)
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
