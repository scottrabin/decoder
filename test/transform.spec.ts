import { expect } from 'chai';

import { DecodeError } from "../lib/decode-error";
import {
    Decoder,
    DecodeResult,
} from "../lib/interface";
import { Number } from "../lib/number";
import { String } from "../lib/string";
import { Transform } from "../lib/transform";

describe('decoder.Transform', () => {
    it('should apply the given function to the decoded result of the provided value', () => {
        const json: any = 8;
        const transformDecoder: Decoder<string> = Transform(Number, n => n.toString());
        const result: DecodeResult<string> = transformDecoder.decode(json);

        expect(result).to.equal('8');
    });

    it('should not suppress errors from the contained decoder', () => {
        const json: any = 12345;
        const transformDecoder: Decoder<number> = Transform(String, v => parseInt(v, 10));
        const result: DecodeResult<number> = transformDecoder.decode(json);

        expect(result).to.be.an.instanceOf(Error);
    });
});
