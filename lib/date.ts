import { DecodeError } from "./decode-error";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import { JSONValue } from "./json";
import { GlobalDate } from "./unshadow";

/**
 * Decodes a number JSONValue into a number.
 */
// tslint:disable-next-line:variable-name
export const Date: Decoder<GlobalDate> = {
    decode(json: JSONValue): DecodeResult<GlobalDate> {
        if (typeof json === "string") {
            return parseDateString(json);
        } else if (typeof json === "number") {
            return parseDateNumber(json);
        } else {
            return new DecodeError("number, RFC 2822, or ISO 8601", json);
        }
    },
};

function parseDateString(json: string): DecodeResult<GlobalDate> {
    const epochTime = GlobalDate.parse(json);

    if (isNaN(epochTime)) {
        return new DecodeError("RFC 2822 or ISO 8601 string", json);
    }

    return new GlobalDate(epochTime);
}

function parseDateNumber(json: number): DecodeResult<GlobalDate> {
    return new GlobalDate(json);
}
