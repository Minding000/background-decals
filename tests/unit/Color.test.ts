import { describe, it, expect } from 'vitest';
import { Color } from '../../src';

describe("Color", () => {

	it("creates an instance using byte values", () => {
		const color = Color.fromBytes(255, 127.5, 0, 255)
		expect(color.getWebGlValues()).toStrictEqual([1, 0.5, 0, 1])
	})
})
