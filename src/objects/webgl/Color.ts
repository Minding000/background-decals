export class Color {
	private static readonly BYTE_MAX_VALUE = 255
	public static readonly RED = Color.fromBytes(Color.BYTE_MAX_VALUE, 0, 0, Color.BYTE_MAX_VALUE)
	public static readonly GREEN = Color.fromBytes(0, Color.BYTE_MAX_VALUE, 0, Color.BYTE_MAX_VALUE)
	public static readonly BLUE = Color.fromBytes(0, 0, Color.BYTE_MAX_VALUE, Color.BYTE_MAX_VALUE)
	public static readonly DEFAULT = Color.BLUE

	private constructor(
		private readonly red: number,
		private readonly green: number,
		private readonly blue: number,
		private readonly opacity: number) {}

	public static fromBytes(red: number, green: number, blue: number, opacity: number): Color {
		return new Color(
			red / this.BYTE_MAX_VALUE,
			green / this.BYTE_MAX_VALUE,
			blue / this.BYTE_MAX_VALUE,
			opacity / this.BYTE_MAX_VALUE,
		)
	}

	public getWebGlValues(): [number, number, number, number] {
		return [this.red, this.green, this.blue, this.opacity]
	}
}
