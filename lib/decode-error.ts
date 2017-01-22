import { JSONValue } from './json';

/**
 * Error type thrown when the decode operation fails.
 */
export class DecodeError extends Error {
    constructor(expected: string, actual: JSONValue) {
        super(`Decode error: expected ${expected}, got ${JSON.stringify(actual)}`);
    }
}
