import { expect } from 'chai';

import { DecodeError } from "../lib/decode-error";
import {
    Decoder,
    DecodeResult,
} from "../lib/interface";
import { OneOf } from "../lib/oneof";

const SuccessDecoder: Decoder<any> = {
    decode(json: any) {
        return json;
    },
};

const FailDecoder: Decoder<any> = {
    decode(json: any) {
        return new DecodeError("intentionally errored", json);
    },
};

describe('decoder.OneOf', () => {
    it('should return the first type if it matches', () => {
        const json: any = 1;
        const oneOfDecoder: Decoder<number | string> = OneOf([SuccessDecoder, FailDecoder]);
        const result: DecodeResult<number | string> = oneOfDecoder.decode(json);

        expect(result).to.equal(json);
    });

    it('should return the second type if it matches', () => {
        const json: any = 'one';
        const oneOfDecoder: Decoder<number | string> = OneOf([FailDecoder, SuccessDecoder]);
        const result: DecodeResult<number | string> = oneOfDecoder.decode(json);

        expect(result).to.equal(json);
    });

    it('should return an error if none of the decoders apply', () => {
        const json: any = true;
        const oneOfDecoder: Decoder<number | string> = OneOf([FailDecoder, FailDecoder]);
        const result: DecodeResult<number | string> = oneOfDecoder.decode(json);

        expect(result).to.be.an.instanceOf(Error);
    });

    it('should be able to match against multiple decoders', () => {
        const json: any = true;
        const oneOfDecoder: Decoder<number | string | boolean> = OneOf([
            FailDecoder,
            FailDecoder,
            SuccessDecoder,
        ]);
        const result: DecodeResult<number | string | boolean> = oneOfDecoder.decode(json);

        expect(oneOfDecoder.decode(json)).to.equal(json);
    });
});
