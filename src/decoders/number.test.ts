import { Err, Ok } from "../utils/result";

import { number } from "./number";

describe("Number", () => {
	test.each([
		{
			value: -1,
			expected: Ok(-1),
		},
		{
			value: 10,
			expected: Ok(10),
		},
		{
			value: 0,
			expected: Ok(0),
		},
		{
			value: 3.14,
			expected: Ok(3.14),
		},
		{
			value: new Number(2.7),
			expected: Ok(2.7),
		},
		{
			value: "not a number",
			expected: Err(new Error('expected number, got "not a number"')),
		},
		{
			value: true,
			expected: Err(new Error("expected number, got true")),
		},
	])("should correctly decode $value", ({ value, expected }) => {
		expect(number.decode(value)).toEqual(expected);
	});
});
