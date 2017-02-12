import { JSONValue } from "./json";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import { isDecodeError } from "./decode-error";

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
