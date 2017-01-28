import { JSONValue } from "./json";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import { isDecodeError } from "./decode-error";

export { Boolean } from "./boolean";
export { Number } from "./number";
export { String } from "./string";
export { Array } from "./array";
export {
    At,
    Dictionary,
    Object,
} from "./object";

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
