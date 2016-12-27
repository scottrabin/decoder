import { GlobalArray, isArray, objectKeys } from './unshadow';

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
 * Determines if the given parameter is a JSONObject
 */
function isObject(param: any): param is JSONObject {
    return (param !== null && typeof param === 'object' && !isArray(param));
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

/**
 * Decodes an arbitrary object, using the decoder map to determine the value at
 * each key.
 */
export function Object<T>(decoderMap: { [K in keyof T]: Decoder<T[K]> }): Decoder<T> {
    return {
        decode(json: JSONValue): T {
            if (isObject(json)) {
                return objectKeys(decoderMap).reduce((result: any, key: keyof T): any => {
                    result[key] = decoderMap[key].decode(json[key]);
                    return result;
                }, {}) as T;
            }

            throw new DecodeError('object', json);
        },
    };
};

/**
 * Decodes a dictionary with arbitrary key mappings to consistent values.
 */
export function Dictionary<T>(decoder: Decoder<T>): Decoder<{ [key: string]: T }> {
    return {
        decode(json: JSONValue): { [key: string]: T } {
            if (isObject(json)) {
                return objectKeys(json).reduce((dict: { [key: string]: T }, key: string) => {
                    dict[key] = decoder.decode(json[key]);
                    return dict;
                }, {});
            }

            throw new DecodeError('object', json);
        },
    };
};

/**
 * Decodes a value that may be missing or null; otherwise, attempts to decode
 * the value.
 */
export function Maybe<T>(decoder: Decoder<T>): Decoder<null | T> {
    return {
        decode(json: JSONValue): null | T {
            if (json) {
                return decoder.decode(json);
            }

            return null;
        },
    };
};

/**
 * Decode a value nested inside multiple levels of objects.
 */
export function At<T>(path: string[], decoder: Decoder<T>): Decoder<T> {
    return {
        decode(json: JSONValue): T {
            const traverseResult: JSONValue = path.reduce((current, key) => {
                if (isObject(current) && (key in current)) {
                    return current[key];
                }

                throw new DecodeError(`value at ${path.join('.')}`, json);
            }, json);

            return decoder.decode(traverseResult);
        },
    };
};
