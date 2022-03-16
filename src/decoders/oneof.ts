import { DecodeError } from "../utils/decode-error";
import { Decoder } from "../utils/interface";
import { Err, Result } from "../utils/result";

/**
 * Creates a decoder which attempts each given decoder, in the order given, until one
 * of the decoders successfully decodes the given value.
 *
 * @example
 * ```typescript
 * const numericDecoder: Decoder<number> = {
 *     decode: (json) => {
 *         const parsedNumber = parseFloat(json);
 *         return isNaN(parsedNumber)
 *             ? Err(new Error("not a number or numeric string"))
 *             : Ok(parsedNumber);
 *     }
 * };
 *
 * const acceptableValues = decoder.oneof(
 *     numericDecoder,
 *     decoder.equals('auto' as const),
 *     decoder.equals('none' as const),
 * );
 *
 * function parseUserInput(input: string) {
 *     const decodeResult = acceptableValues.decode(input);
 *     if (decodeResult.ok) {
 *         doSomethingWithAcceptableValue(decodeResult.value);
 *     } else {
 *         showErrorMessage("Acceptable values are a number, 'auto', or 'none'.");
 *     }
 * }
 * ```
 *
 * @typeParam T the set of types this {@linkcode Decoder} can decode into
 * @param decoders Set of {@linkcode Decoder}s to try, in order, to match a given unknown value
 * @returns a {@linkcode Decoder} for a union of the types decoded by the given decoders
 */
export function oneof<T extends Array<unknown>>(
	...decoders: { [I in keyof T]: Decoder<T[I]> }
): Decoder<T[number]> {
	return {
		decode(json) {
			const results = [];
			for (let i = 0; i < decoders.length; i++) {
				results[i] = decoders[i].decode(json);
				if (results[i].ok) {
					return results[i] as Result<T[number], never>;
				}
			}

			return Err(
				new DecodeError(
					`expected a value to match one of the provided decoders; ${JSON.stringify(
						results.map((result) => (result as { error: Error }).error.message)
					)}`
				)
			);
		},
	};
}
