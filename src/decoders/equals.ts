import { DecodeError } from "../utils/decode-error";
import { Decoder } from "../utils/interface";
import { Err, Ok } from "../utils/result";

function referenceEqual<T>(a: T, b: unknown): boolean {
	return a === b;
}

/**
 * Creates a decoder which compares decoded values for equivalence with the
 * configured value. If `equalsFn` is omitted, reference equality is used.
 *
 * @example
 * ```typescript
 * const v1APIDecoder = decoder.struct({
 *     version: decoder.equals(1 as const),
 *     data: v1APIDataDecoder,
 * });
 * const v2APIDecoder = decoder.struct({
 *     version: decoder.equals(2 as const),
 *     data: v2APIDataDecoder,
 * });
 * const versionedAPIDecoder = oneof(v1APIDecoder, v2APIDecoder);
 *
 * async function respondToVersionedRequests(req: Request, res: Response) {
 *     const decodeResult = versionedAPIDecoder.decode(req.body);
 *     // Typescript cannot narrow this type via `!decodeResult.ok`, so reference equality to `false` is required
 *     if (decodeResult.ok === false) {
 *         // `decodeResult.error` is now an Error indicating the given value is not equal to the desired value
 *         res.json({ error: decodeResult.error.message });
 *         return;
 *     }
 *     // decodeResult is now a value-type / non-error; unfortunately, Typescript cannot narrow nested objects
 *     const { value } = decodeResult;
 *     if (value.version === 1) {
 *         // value.data is now the v1 data type
 *     } else {
 *         // value.data is now the v2 data type
 *     }
 * }
 * ```
 *
 * @typeParam T the type or type literal for the resulting {@linkcode Decoder}
 * @param value desired equivalence value
 * @param equalsFn an optional function to compare values to determine equivalence
 * @returns a {@linkcode Result} indicating whether the decoded value is equivalent to the desired value
 */
export function equals<T>(
	value: T,
	equalsFn: (a: T, b: unknown) => boolean = referenceEqual
): Decoder<T> {
	return {
		decode(json) {
			if (!equalsFn(value, json)) {
				return Err(DecodeError.forType(JSON.stringify(value), json));
			}

			return Ok(value);
		},
	};
}
