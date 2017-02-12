import { JSONValue } from "./json";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import { isDecodeError } from "./decode-error";

/**
 * Transforms an arbitrarily-valued, verified type into a different type as a
 * part of the decode process.
 */
export function Transform<T, TRaw>(decoder: Decoder<TRaw>, mapper: (raw: TRaw) => T): Decoder<T> {
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
