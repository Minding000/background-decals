import { Program } from './webgl';

export abstract class Layer {
	protected context: WebGL2RenderingContext
	protected program: Program

	public abstract setUp(context: WebGL2RenderingContext): void
	public abstract render(): void
}
