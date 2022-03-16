import { DecodeError } from "./decode-error";
import { Result } from "./result";

/**
 * A decoder which attempts to parse a given value as the defined type,
 * returning a Result indicating whether the decode operation was successful
 * as well as the resulting parsed value.
 *
 * @typeParam T the type this decoder will decode into
 */
export interface Decoder<T> {
	decode(json: unknown): Result<T, DecodeError>;
}
