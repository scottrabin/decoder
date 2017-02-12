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
export {
    OneOf2,
    OneOf3,
} from "./oneof";
export {
    Default,
    Maybe,
} from "./option";

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
