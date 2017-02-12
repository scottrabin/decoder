import {
    Decoder,
    DecodeResult,
} from "./interface";
import { JSONValue } from "./json";

/**
 * Decodes a value that may be missing or null; otherwise, attempts to decode
 * the value.
 */
export function Maybe<T>(decoder: Decoder<T>): Decoder<null | T> {
    return Default(decoder, null);
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
