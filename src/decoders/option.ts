import { Decoder } from "../utils/interface";
import { Ok } from "../utils/result";

/**
 * Creates a decoder for a type that may not be present, or may be `null`.
 *
 * If a default value is provided, then this decoder will return that value if
 * the decoded value is `null` or `undefined`.
 *
 * JSON cannot realistically represent `undefined` without simply omitting the
 * key, so if there is no default value and the given value is `null` or `undefined`,
 * then this decoder will return `null`.
 *
 * @example
 * ```typescript
 * const userDecoder = decoder.struct({
 *     user: decoder.struct({
 *         username: decoder.string,
 *         admin: decoder.option(decoder.boolean, false),
 *     }),
 * });
 *
 * async function fetchUser(userId) {
 *     const response = await fetch(`https://api.example.com/users/${userId});
 *     const result = userDecoder.decode(await response.json());
 *     if (result.ok) {
 *         // result.value.user is now an object of type { username: string; admin: boolean; }
 *     } else {
 *         // result.error is now an Error
 *     }
 * }
 * ```
 *
 * @typeParam T type to optionally decode, if the value is present.
 *
 * @param decoder {@linkcode Decoder} for the type that may exist
 * @returns a {@linkcode Decoder} for the optional type
 */
export function option<T>(decoder: Decoder<T>): Decoder<null | T>;
export function option<T>(decoder: Decoder<T>, defaultValue: T): Decoder<T>;
export function option<T>(decoder: Decoder<T>, defaultValue = null) {
	return {
		decode(json: unknown) {
			switch (json) {
				case null:
				case undefined:
					return Ok(defaultValue);
				default:
					return decoder.decode(json);
			}
		},
	};
}
