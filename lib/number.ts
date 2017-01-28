import { DecodeError } from "./decode-error";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import { JSONValue } from "./json";

/**
 * Decodes a number JSONValue into a number.
 */
// tslint:disable-next-line:variable-name
export const Number: Decoder<number> = {
    decode(json: JSONValue): DecodeResult<number> {
        if (typeof json !== "number") {
            return new DecodeError("number", json);
        }

        return json;
    },
};
