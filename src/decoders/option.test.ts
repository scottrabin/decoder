import { Err, Ok } from "../utils/result";

import { number } from "./number";
import { option } from "./option";
import { string } from "./string";

describe("option", () => {
	test.each([
		{
			decoder: option(string),
			value: "a string",
			expected: Ok("a string"),
		},
		{
			decoder: option(string),
			value: null,
			expected: Ok(null),
		},
		{
			decoder: option(string),
			value: undefined,
			expected: Ok(null),
		},
		{
			decoder: option(string),
			value: 10,
			expected: Err(new Error("expected string, got 10")),
		},
		{
			decoder: option(number, 3),
			value: 1,
			expected: Ok(1),
		},
		{
			decoder: option(number, 3),
			value: null,
			expected: Ok(3),
		},
		{
			decoder: option(number, 3),
			value: "a string",
			expected: Err(new Error('expected number, got "a string"')),
		},
	])("should correctly decode $value", ({ decoder, value, expected }) => {
		expect(decoder.decode(value)).toEqual(expected);
	});
});
