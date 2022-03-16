import { Err, Ok } from "../utils/result";

import { number } from "./number";
import { oneof } from "./oneof";
import { string } from "./string";

describe("oneof", () => {
	test.each([
		{
			decoder: oneof(number, string),
			value: "a string",
			expected: Ok("a string"),
		},
		{
			decoder: oneof(number, string),
			value: 3,
			expected: Ok(3),
		},
		{
			decoder: oneof(number, string),
			value: true,
			expected: Err(
				new Error(
					'expected a value to match one of the provided decoders; ["expected number, got true","expected string, got true"]'
				)
			),
		},
	])("should correctly decode $value", ({ decoder, value, expected }) => {
		expect(decoder.decode(value)).toEqual(expected);
	});
});
