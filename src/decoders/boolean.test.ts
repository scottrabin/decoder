import { Err, Ok } from "../utils/result";

import { boolean } from "./boolean";

describe("Boolean", () => {
	test.each([
		{
			value: true,
			expected: Ok(true),
		},
		{
			value: new globalThis.Boolean(false),
			expected: Ok(false),
		},
		{
			value: "not a bool",
			expected: Err(new Error('expected boolean, got "not a bool"')),
		},
	])("should correctly decode $value", ({ value, expected }) => {
		expect(boolean.decode(value)).toEqual(expected);
	});
});
