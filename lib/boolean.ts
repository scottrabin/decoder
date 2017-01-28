import { DecodeError } from "./decode-error";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import { JSONValue } from "./json";

/**
 * Decodes a boolean JSONValue into a boolean.
 */
// tslint:disable-next-line:variable-name
export const Boolean: Decoder<boolean> = {
    decode(json: JSONValue): DecodeResult<boolean> {
        if (typeof json !== "boolean") {
            return new DecodeError("boolean", json);
        }

        return json;
    },
};
