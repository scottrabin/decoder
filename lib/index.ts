import {
    isArray,
    objectKeys,
} from "./unshadow";
import {
    JSONValue,
    JSONObject,
} from "./json";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import {
    DecodeError,
    isDecodeError,
} from "./decode-error";

export { Boolean } from "./boolean";
export { Number } from "./number";

/**
 * Determines if the given parameter is a JSONObject
 */
function isObject(param: any): param is JSONObject {
    return (param !== null && typeof param === "object" && !isArray(param));
}

/**
 * Decodes a string JSONValue into a string.
 */
// tslint:disable-next-line:variable-name
export const String: Decoder<string> = {
    decode(json: JSONValue): DecodeResult<string> {
        if (typeof json !== "string") {
            return new DecodeError("string", json);
        }

        return json;
    },
};

/**
 * Decodes an array JSONValue into an array of decoded types.
 */
export function Array<T>(elementDecoder: Decoder<T>): Decoder<Array<T>> {
    return {
        decode(json: JSONValue): DecodeResult<Array<T>> {
            if (!isArray(json)) {
                return new DecodeError("array", json);
            }

            const resultList: Array<T> = [];
            for (let i = 0; i < json.length; i++) {
                const result: DecodeResult<T> = elementDecoder.decode(json[i]);
                if (isDecodeError(result)) {
                    return result;
                } else {
                    resultList[i] = result;
                }
            }

            return resultList;
        },
    };
}

/**
 * Decodes an arbitrary object, using the decoder map to determine the value at
 * each key.
 */
export function Object<T>(decoderMap: { [K in keyof T]: Decoder<T[K]> }): Decoder<T> {
    return {
        decode(json: JSONValue): DecodeResult<T> {
            if (!isObject(json)) {
                return new DecodeError("object", json);
            }

            // TODO empty object is not assignable to Partial<T>
            // https://github.com/Microsoft/TypeScript/issues/12731
            const result: Partial<T> = {} as Partial<T>;
            const keys: (keyof T)[] = objectKeys(decoderMap) as (keyof T)[];
            for (let key of keys) {
                const vResult = decoderMap[key].decode(json[key]);
                if (isDecodeError(vResult)) {
                    return vResult;
                } else {
                    result[key] = vResult;
                }
            }

            return result as T;
        },
    };
}

/**
 * Maps an arbitrarily-valued, verified type into a different type as a part
 * of the decode process.
 */
export function Map<T, TRaw>(mapper: (raw: TRaw) => T, decoder: Decoder<TRaw>): Decoder<T> {
    return {
        decode(json: JSONValue): DecodeResult<T> {
            const innerResult: DecodeResult<TRaw> = decoder.decode(json);
            if (isDecodeError(innerResult)) {
                return innerResult;
            } else {
                return mapper(innerResult);
            }
        },
    };
}

/**
 * Decodes a dictionary with arbitrary key mappings to consistent values.
 */
export function Dictionary<T>(decoder: Decoder<T>): Decoder<{ [key: string]: T }> {
    return {
        decode(json: JSONValue): DecodeResult<{ [key: string]: T }> {
            if (!isObject(json)) {
                return new DecodeError("object", json);
            }

            const dict: { [key: string]: T } = {};
            for (let key of objectKeys(json)) {
                const vResult = decoder.decode(json[key]);
                if (isDecodeError(vResult)) {
                    return vResult;
                } else {
                    dict[key] = vResult;
                }
            }
            return dict;
        },
    };
}

/**
 * Decodes a value that may be missing or null; otherwise, attempts to decode
 * the value.
 */
export function Maybe<T>(decoder: Decoder<T>): Decoder<null | T> {
    return {
        decode(json: JSONValue): DecodeResult<null | T> {
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
        decode(json: JSONValue): DecodeResult<T> {
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
        decode(json: JSONValue): DecodeResult<T> {
            let traverseResult: JSONValue = json;
            for (let pathKey of path) {
                if (isObject(traverseResult) && (pathKey in traverseResult)) {
                    traverseResult = traverseResult[pathKey];
                } else {
                    return new DecodeError(`value at ${path.join(".")}`, json);
                }
            }

            return decoder.decode(traverseResult);
        },
    };
}

/**
 * Decode a value that may match any one of the given decoders.
 */
export function OneOf2<T1, T2>(d1: Decoder<T1>, d2: Decoder<T2>): Decoder<T1 | T2> {
    return {
        decode(json: JSONValue): DecodeResult<T1 | T2> {
            let result: DecodeResult<T1 | T2> = d1.decode(json);
            if (isDecodeError(result)) {
                result = d2.decode(json);
            }
            // TODO the error messages for this will not reflect the composed
            // nature of the decoder; the notion of "One Of" will be lost.
            return result;
        },
    };
}

export function OneOf3<T1, T2, T3>(d1: Decoder<T1>, d2: Decoder<T2>, d3: Decoder<T3>): Decoder<T1 | T2 | T3> {
    return {
        decode(json: JSONValue): DecodeResult<T1 | T2 | T3> {
            const result: DecodeResult<T1> = d1.decode(json);
            if (isDecodeError(result)) {
                return OneOf2(d2, d3).decode(json);
            } else {
                return result;
            }
        },
    };
}
