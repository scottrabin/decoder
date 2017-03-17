import {
    DecodeError,
    isDecodeError,
} from "./decode-error";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import {
    JSONValue,
    JSONObject,
    isObject,
} from "./json";

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
 * Decodes a dictionary with arbitrary key mappings to consistent values.
 */
export function Dictionary<T>(decoder: Decoder<T>): Decoder<{ [key: string]: T }> {
    return {
        decode(json: JSONValue): DecodeResult<{ [key: string]: T }> {
            if (!isObject(json)) {
                return new DecodeError("object", json);
            }

            const dict: { [key: string]: T } = {};
            for (let key of Object.keys(json)) {
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
 * Decodes a structured object, using the decoder map to determine the value at
 * each key.
 */
export function Struct<T>(decoderMap: { [K in keyof T]: Decoder<T[K]> }): Decoder<T> {
    return {
        decode(json: JSONValue): DecodeResult<T> {
            if (!isObject(json)) {
                return new DecodeError("object", json);
            }

            // TODO empty object is not assignable to Partial<T>
            // https://github.com/Microsoft/TypeScript/issues/12731
            const result: Partial<T> = {} as Partial<T>;
            const keys: (keyof T)[] = Object.keys(decoderMap) as (keyof T)[];
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
