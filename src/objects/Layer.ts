import { Program, Shader } from './webgl';

export abstract class Layer {
	protected context: WebGL2RenderingContext|null = null
	protected program: Program|null = null

	public abstract setUp(context: WebGL2RenderingContext): void

	protected setUpProgram(context: WebGL2RenderingContext, vertexShaderCode: string, fragmentShaderCode: string): void {
		this.context = context
		this.program = new Program(context,[
			new Shader(vertexShaderCode, "vertex"),
			new Shader(fragmentShaderCode, "fragment")
		])
		this.program.use()
		console.debug("--- Program complete ---")
	}

	public abstract render(): void
}
