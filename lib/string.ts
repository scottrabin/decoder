import { DecodeError } from "./decode-error";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import { JSONValue } from "./json";

/**
 * Decodes a string JSONValue into a string.
 */
// tslint:disable-next-line:variable-name
export const String: Decoder<string> = {
    decode(json: JSONValue): DecodeResult<string> {
        if (typeof json !== "string") {
            return new DecodeError("string", json);
        }

        return json;
    },
};
