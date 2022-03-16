import { array as isArray } from "is-js";

import { DecodeError } from "../utils/decode-error";
import { Decoder } from "../utils/interface";
import { Err, Ok } from "../utils/result";

/**
 * Decodes an unknown value into an array of identical elements.
 *
 * @example
 * ```typescript
 * const arrayOfStringsDecoder = decoder.array(decoder.string);
 *
 * async function getTodoList() {
 *     const response = await fetch("https://api.example.com/my-todos");
 *     const decodeResult = arrayOfStringsDecoder.decode(await response.json());
 *     if (decodeResult.ok) {
 *         // decodeResult.value is now of type Array<string>
 *     } else {
 *         // decodeResult.error is now an Error with a message describing which
 *         // index failed to conform to the desired type
 *     }
 * }
 * ```
 *
 * @typeParam T the element type of the decoded array
 * @param elementDecoder {@linkcode Decoder} used for each element of the array
 * @returns a {@linkcode Decoder} for an array of consistent elements
 */
export function array<T>(elementDecoder: Decoder<T>): Decoder<Array<T>> {
	return {
		decode(json) {
			if (!isArray(json)) {
				return Err(DecodeError.forType("array", json));
			}

			const resultList: Array<T> = new Array(json.length);

			for (let i = 0; i < json.length; i++) {
				const result = elementDecoder.decode(json[i]);
				if (result.ok) {
					resultList[i] = result.value;
				} else {
					return Err(result.error.extend(i));
				}
			}

			return Ok(resultList);
		},
	};
}
