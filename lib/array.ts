import {
    DecodeError,
    isDecodeError,
} from "./decode-error";
import {
    Decoder,
    DecodeResult,
} from "./interface";
import { JSONValue } from "./json";
import { isArray } from "./unshadow";

/**
 * Decodes an array JSONValue into an array of decoded types.
 */
export function Array<T>(elementDecoder: Decoder<T>): Decoder<Array<T>> {
    return {
        decode(json: JSONValue): DecodeResult<Array<T>> {
            if (!isArray(json)) {
                return new DecodeError("array", json);
            }

            const resultList: Array<T> = [];
            for (let i = 0; i < json.length; i++) {
                const result: DecodeResult<T> = elementDecoder.decode(json[i]);
                if (isDecodeError(result)) {
                    return result;
                } else {
                    resultList[i] = result;
                }
            }

            return resultList;
        },
    };
}
