import { DecodeError } from "./decode-error";

export type DecodeResult<T> = T | DecodeError;

export interface Decoder<T> {
    decode(json: any): DecodeResult<T>;
}
