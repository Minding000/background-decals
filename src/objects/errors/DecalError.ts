import { WebGlError } from './WebGlError';

export class DecalError extends Error {

	constructor(message: string, public cause: unknown) {
		super(message);
		Object.setPrototypeOf(this, DecalError.prototype);
	}

	public toString(): string {
		let stringRepresentation = this.message
		stringRepresentation += "\n"
		stringRepresentation += this.stack
		stringRepresentation += "\n"
		if(this.cause instanceof WebGlError) {
			stringRepresentation += this.cause
		} else if(this.cause instanceof Error) {
			stringRepresentation += this.cause.message
			stringRepresentation += "\n"
			stringRepresentation += this.cause.stack
		} else {
			stringRepresentation += this.cause
		}
		return stringRepresentation
	}
}
