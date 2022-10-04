export class WebGlError extends Error {

	constructor(message: string, public webGlMessage: string|null) {
		super(message);
		Object.setPrototypeOf(this, WebGlError.prototype);
	}

	public toString(): string {
		let stringRepresentation = this.message
		if(this.webGlMessage)
			stringRepresentation += `: ${this.webGlMessage}`
		stringRepresentation += "\n"
		stringRepresentation += this.stack
		return stringRepresentation
	}
}
