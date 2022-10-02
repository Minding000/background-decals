export class WebGlError extends Error {

	constructor(message: string, public webGlMessage: string) {
		super(message);
		Object.setPrototypeOf(this, WebGlError.prototype);
	}

	public toString(): string {
		let stringRepresentation = `${this.message}: ${this.webGlMessage}`
		stringRepresentation += "\n"
		stringRepresentation += this.stack
		return stringRepresentation
	}
}
