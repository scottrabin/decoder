/**
 * A `Result` type indicating success, in which case the object has a `value` key of type `T`,
 * or failure, in which case the object has an `error` key of type `E`.
 *
 * @typeParam T the type of `value` if the result indicates success
 * @typeParam E the type of `error` if the result indicates failure
 */
export type Result<T, E> =
	| {
			ok: true;
			value: T;
	  }
	| {
			ok: false;
			error: E;
	  };

/**
 * @param value - The value of a successful operation
 * @returns the Result object representing a successful operation
 */
export function Ok<T, E>(value: T): Result<T, E> {
	return { ok: true, value };
}

/**
 * @param error - The error encountered when an operation failed
 * @returns the Result object representing failed operation
 */
export function Err<T, E>(error: E): Result<T, E> {
	return { ok: false, error };
}
