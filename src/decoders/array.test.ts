import { Err, Ok } from "../utils/result";
import { Decoder } from "../utils/interface";

import { array } from "./array";
import { boolean } from "./boolean";
import { number } from "./number";
import { string } from "./string";

const AnyDecoder: Decoder<any> = {
	decode: (json) => Ok(json),
};

describe("array", () => {
	test.each([
		{
			decoder: boolean,
			value: [true, false],
			expected: Ok([true, false]),
		},
		{
			decoder: boolean,
			value: [1, 2, 3],
			expected: Err(new Error("[0]: expected boolean, got 1")),
		},
		{
			decoder: boolean,
			value: ["a string"],
			expected: Err(new Error('[0]: expected boolean, got "a string"')),
		},
		{
			decoder: number,
			value: [1, 2, 3],
			expected: Ok([1, 2, 3]),
		},
		{
			decoder: string,
			value: ["", "a nonempty string"],
			expected: Ok(["", "a nonempty string"]),
		},
		{
			decoder: AnyDecoder,
			value: true,
			expected: Err(new Error("expected array, got true")),
		},
		{
			decoder: AnyDecoder,
			value: { length: 3 },
			expected: Err(new Error('expected array, got {"length":3}')),
		},
	])("should correctly decode $value", ({ decoder, value, expected }) => {
		const result = array(decoder).decode(value);

		expect(result).toEqual(expected);
	});
});
