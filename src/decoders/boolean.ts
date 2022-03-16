import { bool } from "is-js";

import { DecodeError } from "../utils/decode-error";
import { Decoder } from "../utils/interface";
import { Err, Ok } from "../utils/result";

/**
 * Decodes an unknown value into a boolean.
 */
export const boolean: Decoder<boolean> = {
	decode(json) {
		if (!bool(json)) {
			return Err(DecodeError.forType("boolean", json));
		}

		return Ok(json.valueOf());
	},
};
