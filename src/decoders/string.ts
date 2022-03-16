import { string as isString } from "is-js";

import { DecodeError } from "../utils/decode-error";
import { Decoder } from "../utils/interface";
import { Err, Ok } from "../utils/result";

/**
 * Decodes an unknown value into a string.
 */
export const string: Decoder<string> = {
	decode(json) {
		if (!isString(json)) {
			return Err(DecodeError.forType("string", json));
		}

		return Ok(json.valueOf());
	},
};
