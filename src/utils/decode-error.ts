/**
 * A custom error type for decoding, which stores the path at which a decode operation
 * may have failed.
 */
export class DecodeError extends Error {
	constructor(private baseMessage: string, public path?: Array<string>) {
		super(toMessage(path, baseMessage));
	}

	/**
	 *
	 * @param path the link in the path at which this decode operation failed
	 * @returns a new {@linkcode DecodeError} which
	 */
	extend(path: string | number): DecodeError {
		this.path = [path.toString()].concat(this.path ?? []);
		this.message = toMessage(this.path, this.baseMessage);
		this.stack = [
			this.message,
			...(this.stack?.split("\n")?.slice(1) ?? []),
		].join("\n");

		return this;
	}

	/**
	 *
	 * @param expected name of the expected type for the decoder
	 * @param actual value which failed to decode
	 * @returns a {@linkcode DecodeError} indicating a failure to decode due to mismatched types
	 */
	static forType = (expected: string, actual: unknown): DecodeError => {
		const error = new DecodeError(
			`expected ${expected}, got ${JSON.stringify(actual)}`
		);
		error.stack = error.stack
			?.split("\n")
			.filter((line) => !line.includes("DecodeError.forType"))
			.join("\n");

		return error;
	};
}

function toMessage(path: undefined | Array<string>, message: string) {
	return path
		? `${path.map((p) => "[" + p + "]").join("")}: ${message}`
		: message;
}
