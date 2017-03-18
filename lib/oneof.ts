import {
    DecodeError,
    isDecodeError,
} from "./decode-error";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import { JSONValue } from "./json";

export function OneOf<T1, T2>(ds: [Decoder<T1>, Decoder<T2>]): Decoder<T1 | T2>;
export function OneOf<T1, T2, T3>(ds: [Decoder<T1>, Decoder<T2>, Decoder<T3>]): Decoder<T1 | T2 | T3>;
export function OneOf<T1, T2, T3, T4>(ds: [Decoder<T1>, Decoder<T2>, Decoder<T3>, Decoder<T4>]): Decoder<T1 | T2 | T3 | T4>;
export function OneOf<T1, T2, T3, T4, T5>(ds: [Decoder<T1>, Decoder<T2>, Decoder<T3>, Decoder<T4>, Decoder<T5>]): Decoder<T1 | T2 | T3 | T4 | T5>;
export function OneOf<T1, T2, T3, T4, T5, T6>(ds: [Decoder<T1>, Decoder<T2>, Decoder<T3>, Decoder<T4>, Decoder<T5>, Decoder<T6>]): Decoder<T1 | T2 | T3 | T4 | T5 | T6>
export function OneOf<T1, T2, T3, T4, T5, T6, T7>(ds: [Decoder<T1>, Decoder<T2>, Decoder<T3>, Decoder<T4>, Decoder<T5>, Decoder<T6>, Decoder<T7>]): Decoder<T1 | T2 | T3 | T4 | T5 | T6 | T7>
export function OneOf<T1, T2, T3, T4, T5, T6, T7, T8>(ds: [Decoder<T1>, Decoder<T2>, Decoder<T3>, Decoder<T4>, Decoder<T5>, Decoder<T6>, Decoder<T7>, Decoder<T8>]): Decoder<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8> {
    return {
        decode(json: JSONValue) {
            for (let i = 0; i < ds.length; i++) {
                const result = ds[i].decode(json);

                if (!isDecodeError(result)) {
                    return result;
                }
            }

            return new DecodeError(JSON.stringify(ds), json);
        }
    }
}
