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
