import { Decoder } from "../utils/interface";
import { Err, Ok } from "../utils/result";

import { number } from "./number";
import { dict, struct } from "./object";
import { string } from "./string";

describe("dict", () => {
	test.each([
		{
			decoder: string,
			value: {
				firstKey: "a string",
				secondKey: "another string",
			},
			expected: Ok({
				firstKey: "a string",
				secondKey: "another string",
			}),
		},
		{
			decoder: number,
			value: {
				firstKey: 1,
				secondKey: "not a number",
			},
			expected: Err(
				new Error('[secondKey]: expected number, got "not a number"')
			),
		},
		{
			decoder: string,
			value: "not an object",
			expected: Err(new Error('expected object, got "not an object"')),
		},
	])("should correctly decode $value", ({ decoder, value, expected }) => {
		const dictDecoder = dict(decoder as Decoder<string | number>);

		expect(dictDecoder.decode(value)).toEqual(expected);
	});
});

describe("struct", () => {
	test.each([
		{
			decoder: struct({
				firstKey: string,
				secondKey: number,
			}),
			value: {
				firstKey: "this is a string",
				secondKey: 5,
			},
			expected: Ok({
				firstKey: "this is a string",
				secondKey: 5,
			}),
		},
		{
			decoder: struct({
				string: string,
				number: number,
			}),
			value: {
				string: "a string",
				number: "also a string",
			},
			expected: Err(
				new Error('[number]: expected number, got "also a string"')
			),
		},
		{
			decoder: struct({}),
			value: "a string",
			expected: Err(new Error('expected object, got "a string"')),
		},
		{
			decoder: struct({
				desiredKey: string,
			}),
			value: {
				desiredKey: "keep",
				extraKey: false,
			},
			expected: Ok({ desiredKey: "keep" }),
		},
	])(
		"should correctly extract the desired shape from $value",
		({ decoder, value, expected }) => {
			expect(decoder.decode(value)).toEqual(expected);
		}
	);
});
