import { Err, Ok } from "../utils/result";

import { string } from "./string";

describe("String", () => {
	test.each([
		{
			value: "",
			expected: Ok(""),
		},
		{
			value: "a string",
			expected: Ok("a string"),
		},
		{
			value: null,
			expected: Err(new Error("expected string, got null")),
		},
		{
			value: 3,
			expected: Err(new Error("expected string, got 3")),
		},
		{
			value: true,
			expected: Err(new Error("expected string, got true")),
		},
		{
			value: {},
			expected: Err(new Error("expected string, got {}")),
		},
	])("should correctly decode $value", ({ value, expected }) => {
		expect(string.decode(value)).toEqual(expected);
	});
});
