import { Err, Ok } from "../utils/result";
import { boolean } from "./boolean";
import { number } from "./number";
import { string } from "./string";
import { tuple } from "./tuple";

describe("tuple", () => {
	test.each([
		{
			decoder: tuple(string, number, boolean),
			value: ["one", 2, true],
			expected: Ok(["one", 2, true]),
		},
		{
			decoder: tuple(number, string),
			value: [1, "two", false],
			expected: Ok([1, "two"]),
		},
		{
			decoder: tuple(number),
			value: 1,
			expected: Err(new Error("expected array, got 1")),
		},

		{
			decoder: tuple(number, string),
			value: [1, 2],
			expected: Err(new Error("[1]: expected string, got 2")),
		},
	])("should decode $value correctly", ({ decoder, value, expected }) => {
		expect(decoder.decode(value)).toEqual(expected);
	});
});
