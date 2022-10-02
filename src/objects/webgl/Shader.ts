export class Shader {

	public constructor(
		private code: string,
		private type: "vertex" | "fragment"
	) {}

	public getWebGlShader(context: WebGL2RenderingContext): WebGLShader {
		const shader = context.createShader(this.getWebGlType(context))
		context.shaderSource(shader, this.code)
		context.compileShader(shader)
		return shader
	}

	private getWebGlType(context: WebGL2RenderingContext): number {
		return this.type === "vertex" ? context.VERTEX_SHADER : context.FRAGMENT_SHADER
	}
}
