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
		stringRepresentation += this.cause
		return stringRepresentation
	}
}
