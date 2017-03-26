import { DecodeError } from "./decode-error";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import { JSONValue } from "./json";

/**
 * Asserts a value is strictly equal to the provided value.
 */
export function Equal(value: boolean): Decoder<boolean>;
export function Equal(value: null): Decoder<null>;
export function Equal(value: number): Decoder<number>;
export function Equal(value: string): Decoder<string>;
export function Equal(value: boolean | null | number | string): Decoder<boolean | null | number | string> {
    return {
        decode(json: JSONValue) {
            if (json !== value) {
                return new DecodeError("" + value, json);
            }

            return value;
        },
    };
}
