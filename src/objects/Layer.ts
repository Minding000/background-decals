import { Program, Shader } from './webgl';

export abstract class Layer {
	protected context: WebGL2RenderingContext
	protected program: Program

	public abstract setUp(context: WebGL2RenderingContext): void

	protected setUpProgram(context: WebGL2RenderingContext, vertexShaderCode: string, fragmentShaderCode: string): void {
		this.context = context
		this.program = new Program(context,[
			new Shader(vertexShaderCode, "vertex"),
			new Shader(fragmentShaderCode, "fragment")
		])
		this.program.use()
	}

	public abstract render(): void
}
