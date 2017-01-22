import {
    isArray,
    objectKeys,
} from "./unshadow";
import {
    JSONValue,
    JSONObject,
} from "./json";
import { Decoder } from "./interface";
import { DecodeError } from "./decode-error";

/**
 * Determines if the given parameter is a JSONObject
 */
function isObject(param: any): param is JSONObject {
    return (param !== null && typeof param === "object" && !isArray(param));
}

/**
 * Decodes a boolean JSONValue into a boolean.
 */
// tslint:disable-next-line:variable-name
export const Boolean: Decoder<boolean> = {
    decode(json: JSONValue): boolean {
        if (typeof json !== "boolean") {
            throw new DecodeError("boolean", json);
        }

        return json;
    },
};

/**
 * Decodes a number JSONValue into a number.
 */
// tslint:disable-next-line:variable-name
export const Number: Decoder<number> = {
    decode(json: JSONValue): number {
        if (typeof json !== "number") {
            throw new DecodeError("number", json);
        }

        return json;
    },
};

/**
 * Decodes a string JSONValue into a string.
 */
// tslint:disable-next-line:variable-name
export const String: Decoder<string> = {
    decode(json: JSONValue): string {
        if (typeof json !== "string") {
            throw new DecodeError("string", json);
        }

        return json;
    },
};

/**
 * Decodes an array JSONValue into an array of decoded types.
 */
export function Array<T>(elementDecoder: Decoder<T>): Decoder<Array<T>> {
    return {
        decode(json: JSONValue): Array<T> {
            if (!isArray(json)) {
                throw new DecodeError("array", json);
            }

            return json.map(elementDecoder.decode, elementDecoder);
        },
    };
}

/**
 * Decodes an arbitrary object, using the decoder map to determine the value at
 * each key.
 */
export function Object<T>(decoderMap: { [K in keyof T]: Decoder<T[K]> }): Decoder<T> {
    return {
        decode(json: JSONValue): T {
            if (!isObject(json)) {
                throw new DecodeError("object", json);
            }

            return objectKeys(decoderMap).reduce((result: any, key: keyof T): any => {
                result[key] = decoderMap[key].decode(json[key]);
                return result;
            }, {});
        },
    };
}

/**
 * Maps an arbitrarily-valued, verified type into a different type as a part
 * of the decode process.
 */
export function Map<T, TRaw>(mapper: (raw: TRaw) => T, decoder: Decoder<TRaw>): Decoder<T> {
    return {
        decode(json: JSONValue): T {
            return mapper(decoder.decode(json));
        },
    };
}

/**
 * Decodes a dictionary with arbitrary key mappings to consistent values.
 */
export function Dictionary<T>(decoder: Decoder<T>): Decoder<{ [key: string]: T }> {
    return {
        decode(json: JSONValue): { [key: string]: T } {
            if (!isObject(json)) {
                throw new DecodeError("object", json);
            }

            return objectKeys(json).reduce((dict: { [key: string]: T }, key: string) => {
                dict[key] = decoder.decode(json[key]);
                return dict;
            }, {});
        },
    };
}

/**
 * Decodes a value that may be missing or null; otherwise, attempts to decode
 * the value.
 */
export function Maybe<T>(decoder: Decoder<T>): Decoder<null | T> {
    return {
        decode(json: JSONValue): null | T {
            switch (json) {
            case null:
            case void 0:
                return null;
            default:
                return decoder.decode(json);
            }
        },
    };
}

/**
 * Attempts to decode the given JSON if it is non-null; otherwise, yields the
 * provided default value.
 */
export function Default<T>(decoder: Decoder<T>, defaultValue: T): Decoder<T> {
    return {
        decode(json: JSONValue): T {
            switch (json) {
            case null:
            case void 0:
                return defaultValue;
            default:
                return decoder.decode(json);
            }
        },
    };
}

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

                throw new DecodeError(`value at ${path.join(".")}`, json);
            }, json);

            return decoder.decode(traverseResult);
        },
    };
}

/**
 * Decode a value that may match any one of the given decoders.
 */
export function OneOf2<T1, T2>(d1: Decoder<T1>, d2: Decoder<T2>): Decoder<T1 | T2> {
    return {
        decode(json: JSONValue): T1 | T2 {
            try {
                return d1.decode(json);
            } catch (e) {
                // TODO the error messages for this will not reflect the composed
                // nature of the decoder; the notion of "One Of" will be lost.
                return d2.decode(json);
            }
        },
    };
}

export function OneOf3<T1, T2, T3>(d1: Decoder<T1>, d2: Decoder<T2>, d3: Decoder<T3>): Decoder<T1 | T2 | T3> {
    return {
        decode(json: JSONValue): T1 | T2 | T3 {
            try {
                return d1.decode(json);
            } catch (_) {
                return OneOf2(d2, d3).decode(json);
            }
        },
    };
}
