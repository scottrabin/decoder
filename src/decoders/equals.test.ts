import { Err, Ok } from "../utils/result";

import { equals } from "./equals";

describe("equals", () => {
	test.each([
		{
			compareValue: 1,
			value: 1,
			expected: Ok(1),
		},
		{
			compareValue: 1,
			value: 2,
			expected: Err(new Error("expected 1, got 2")),
		},
		{
			compareValue: true,
			value: false,
			expected: Err(new Error("expected true, got false")),
		},
	])(
		"should correctly decode $value as compared with $compareValue",
		({ value, compareValue, expected }) => {
			const decoder = equals(compareValue);
			expect(decoder.decode(value)).toEqual(expected);
		}
	);

	it("should use the provided equality function to determine success", () => {
		const compareValue = { id: 1, irrelevantExtraProperty: "one" };
		const value = { id: 1, irrelevantExtraProperty: "two" };
		const equalityFn = (a: { id: number }, b: unknown) =>
			a.id === (b as any).id;

		const decoder = equals(compareValue, equalityFn);

		expect(decoder.decode(value)).toEqual(Ok(compareValue));
	});
});
