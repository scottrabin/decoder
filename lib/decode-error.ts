import { JSONValue } from './json';

const DECODE_ERROR_TAG: string = "Decode error";

/**
 * Error type thrown when the decode operation fails.
 */
export class DecodeError extends Error {
    constructor(expected: string, actual: JSONValue) {
        super(`${DECODE_ERROR_TAG}: expected ${expected}, got ${JSON.stringify(actual)}`);
    }
}

// Extending built-ins like Error doesn't work quite as expected
// https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
export function isDecodeError(param: any): param is DecodeError {
    return (param instanceof Error && param.message.indexOf(DECODE_ERROR_TAG) === 0);
}
