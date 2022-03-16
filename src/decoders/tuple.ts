import { array } from "is-js";

import { DecodeError } from "../utils/decode-error";
import { Decoder } from "../utils/interface";
import { Err, Ok } from "../utils/result";

/**
 * Decodes a given array into a Typescript tuple with a fixed number of elements,
 * possibly with different types.
 *
 * @example
 * ```typescript
 * const latLngDecoder = decoder.tuple(decoder.number, decoder.number);
 * const geoDecoder = decoder.struct({
 *     markers: decoder.array(latLngDecoder),
 * });
 *
 * async function fetchGeoData() {
 *     const response = await fetch("https://api.example.com/points-of-interest");
 *     const decodeResult = geoDecoder.decode(await response.json());
 *     if (decodeResult.ok) {
 *         // decodeResult.value.markers is an array of lat/long tuples
 *         addMarkersToMap(decodeResult.value.markers);
 *     } else {
 *         // decodeResult is now an Error, which may indicate an index that failed to decode
 *     }
 * }
 * ```
 *
 * @typeParam T the tuple type to decode
 * @param decoders Set of {@linkcode Decoder}s to apply to each element of the given array
 * @returns a {@linkcode Result} of the attempt to decode the given value as a tuple
 */
export function tuple<T extends Array<unknown>>(
	...decoders: { [I in keyof T]: Decoder<T[I]> }
): Decoder<T> {
	return {
		decode(json) {
			if (!array(json)) {
				return Err(DecodeError.forType("array", json));
			}

			const resultTuple = new Array(decoders.length);

			for (let i = 0; i < decoders.length; i++) {
				const result = decoders[i].decode(json[i]);
				if (result.ok) {
					resultTuple[i] = result.value;
				} else {
					return Err(result.error.extend(i));
				}
			}

			return Ok(resultTuple as T);
		},
	};
}
