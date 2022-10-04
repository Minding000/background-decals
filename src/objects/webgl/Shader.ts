import { WebGlError } from '../errors';
import { Program } from './Program';

export class Uniform {
	private static readonly NOT_FOUND = -1
	private readonly memoryLocation: WebGLUniformLocation
	private readonly storeFunctionName: string

	public constructor(
		private readonly program: Program,
		private readonly type: string,
		public readonly name: string,
	) {
		const memoryLocation = program.context.getUniformLocation(program.program, name)
		if(!memoryLocation)
			throw new Error(`Failed to find memory location of uniform '${this}'.`)
		this.memoryLocation = memoryLocation
		this.storeFunctionName = this.getStoreFunctionName()
	}

	public setValues(...values: number[]): void {
		// @ts-ignore - Dynamic amount of parameters,
		// because the possible function take different numbers of parameters
		this.program.context[this.storeFunctionName](this.memoryLocation, ...values)
	}

	private getStoreFunctionName(): string {
		// Detects types in the format of: <1-4> <i|ui|iv|uiv|f|fv>
		const vectorType = "vec"
		const vecPosition = this.type.indexOf(vectorType)
		let valueCount: string
		let baseType: string|null = null
		if(vecPosition === Uniform.NOT_FOUND) {
			valueCount = "1"
		} else {
			valueCount = this.type.substring(vecPosition + vectorType.length)
			if(this.type.startsWith(vectorType))
				baseType = "f" //TODO is this guaranteed to be a float?
		}
		if(this.type.startsWith("i")) {
			baseType = "i"
		} else if(this.type.startsWith("f")) {
			baseType = "f"
		} else if(this.type.startsWith("u")) {
			baseType = "ui"
		} else if(!baseType) {
			throw new Error(`Failed to determine WebGL2 type of '${this}'.`)
		}
		//TODO does not handle array and matrix types
		return `uniform${valueCount + baseType}`
	}

	public toString(): string {
		return `uniform ${this.type} ${this.name};`
	}
}

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
