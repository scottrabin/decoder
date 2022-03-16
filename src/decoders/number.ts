import { number as isNumber } from "is-js";

import { DecodeError } from "../utils/decode-error";
import { Decoder } from "../utils/interface";
import { Err, Ok } from "../utils/result";

/**
 * Decodes an unknown value into a number.
 */
export const number: Decoder<number> = {
	decode(json) {
		if (!isNumber(json)) {
			return Err(DecodeError.forType("number", json));
		}

		return Ok(json.valueOf());
	},
};
