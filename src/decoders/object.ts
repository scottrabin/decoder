import { object } from "is-js";

import { DecodeError } from "../utils/decode-error";
import { Decoder } from "../utils/interface";
import { Err, Ok } from "../utils/result";

/**
 * Decodes a dictionary with arbitrary key mappings to consistent values.
 *
 * @example
 * ```typescript
 * const userGeneratedContentDecoder = decoder.struct({
 *     content: decoder.string,
 *     atMentions: decoder.dict(decoder.struct({ displayName: decoder.string })),
 * });
 *
 * async function getPostContents(postId: string) {
 *     const apiResponse = await fetch(`https://api.example.com/posts/${postId}`);
 *     const decodeResult = userGeneratedContentDecoder.decode(await apiResponse.json());
 *     if (decodeResult.ok) {
 *         // decodeResult.value.atMentions is now an object of type `Record<string, string>`
 *         return decodeResult.value.content.replace(/@(\w+)/g, (match) => decodeResult.value.atMentions[match.substring(1)]?.displayName ?? match);
 *     } else {
 *         // decodeResult.error is now an Error describing which key failed to conform to the desired type
 *     }
 * }
 * ```
 *
 * @typeParam T type of the values in the resulting dictionary/record
 *
 * @param decoder decoder for the value of each member of the dictionary
 * @returns a decoder for objects with consistent value types and arbitrary keys
 */
export function dict<T>(decoder: Decoder<T>): Decoder<Record<string, T>> {
	return {
		decode(json) {
			if (!object(json)) {
				return Err(DecodeError.forType("object", json));
			}

			const dict: Record<string, T> = {};
			for (const key of Object.keys(json)) {
				const result = decoder.decode(json[key as keyof typeof json]);
				if (result.ok) {
					dict[key] = result.value;
				} else {
					return Err(result.error.extend(key));
				}
			}
			return Ok(dict);
		},
	};
}

/**
 * Decodes a structured object, using the decoder map to determine the value at
 * each key.
 *
 * @example
 * ```typescript
 * const saveDataDecoder = decoder.struct({
 *     favorites: decoder.array(decoder.number),
 *     bookmarks: decoder.array(decoder.string),
 * });
 *
 * function loadSaveData() {
 *     const decodeResult = saveDataDecoder.decode(localStorage.getItem('saveData'));
 *     if (decodeResult.ok) {
 *         // decodeResult.value is now an object of type { favorites: number[], bookmarks: string[] }
 *         return decodeResult.value;
 *     } else {
 *         // decodeResult.error is now an Error describing which key failed to conform to the desired type
 *         return { favorites: [], bookmarks: [] };
 *     }
 * }
 * ```
 *
 * @typeParam T return type of the structured object
 *
 * @param decoderMap a map of key to the decoder for the type expected at that key
 * @returns a decoder for objects with a known structure
 */
export function struct<T>(decoderMap: {
	[K in keyof T]: Decoder<T[K]>;
}): Decoder<T> {
	return {
		decode(json) {
			if (!object(json)) {
				return Err(DecodeError.forType("object", json));
			}

			const struct: Partial<T> = {};
			for (const key of Object.keys(decoderMap)) {
				const result = decoderMap[key as keyof T].decode(
					(json as { [key: string]: unknown })[key]
				);
				if (result.ok) {
					struct[key as keyof T] = result.value;
				} else {
					return Err(result.error.extend(key));
				}
			}
			return Ok(struct as T);
		},
	};
}
