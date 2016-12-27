/**
 * Define the different types represented in JSON
 */
type JSONValue = null | string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
    [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> { }

export interface Decoder<T> {
    decode(json: JSONValue): T;
}

/**
 * Error type thrown when the decode operation fails.
 */
class DecodeError extends Error {
    constructor(expected: string, actual: JSONValue) {
        super(`Decode error: expected ${expected}, got ${JSON.stringify(actual)}`);
    }
}

/**
 * Decodes a string JSONValue into a string.
 */
export const String: Decoder<string> = {
    decode(json: JSONValue): string {
        if (typeof json === 'string') {
            return json;
        }

        throw new DecodeError('string', json);
    },
};
