import { GlobalArray, isArray } from './unshadow';

/**
 * Define the different types represented in JSON
 */
type JSONValue = null | string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
    [x: string]: JSONValue;
}

interface JSONArray extends GlobalArray<JSONValue> { }

export interface Decoder<T> {
    decode(json: any): T;
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
 * Decodes a boolean JSONValue into a boolean.
 */
export const Boolean: Decoder<boolean> = {
    decode(json: JSONValue): boolean {
        if (typeof json === 'boolean') {
            return json;
        }

        throw new DecodeError('boolean', json);
    },
};

/**
 * Decodes a number JSONValue into a number.
 */
export const Number: Decoder<number> = {
    decode(json: JSONValue): number {
        if (typeof json === 'number') {
            return json;
        }

        throw new DecodeError('number', json);
    },
};

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

/**
 * Decodes an array JSONValue into an array of decoded types.
 */
export function Array<T>(elementDecoder: Decoder<T>): Decoder<Array<T>> {
    return {
        decode(json: JSONValue): Array<T> {
            if (isArray(json)) {
                return json.map(elementDecoder.decode, elementDecoder);
            }

            throw new DecodeError('array', json);
        },
    };
};
