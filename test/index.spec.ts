import { expect } from 'chai';
import {
    Decoder,
    DecodeResult,
} from '../lib/interface';
import * as decoder from '../lib/index';

const TEST_CASES = [
    {
        type: 'boolean',
        value: true,
    },
    {
        type: 'number',
        value: 12345,
    },
    {
        type: 'string',
        value: 'this is an example string',
    },
    {
        type: 'array',
        value: [],
    },
    {
        type: 'object',
        value: {},
    },
];

describe('decoder.Map', () => {
    it('should apply the given function to the decoded result of the provided value', () => {
        const json: any = 8;
        const mapDecoder: Decoder<string> = decoder.Map(n => n.toString(), decoder.Number);

        expect(mapDecoder.decode(json)).to.equal('8');
    });

    it('should not suppress errors from the contained decoder', () => {
        const json: any = 12345;
        const mapDecoder: Decoder<number> = decoder.Map(v => parseInt(v, 10), decoder.String);
        const result: DecodeResult<number> = mapDecoder.decode(json);

        expect(result).to.be.an.instanceOf(Error);
    });
});

describe('decoder.OneOf', () => {
    it('should return the first type if it matches', () => {
        const json: any = 1;
        const oneOfDecoder: Decoder<number | string> = decoder.OneOf2(decoder.Number, decoder.String);
        const result: DecodeResult<number | string> = oneOfDecoder.decode(json);

        expect(result).to.equal(json);
    });

    it('should return the second type if it matches', () => {
        const json: any = 'one';
        const oneOfDecoder: Decoder<number | string> = decoder.OneOf2(decoder.Number, decoder.String);
        const result: DecodeResult<number | string> = oneOfDecoder.decode(json);

        expect(result).to.equal(json);
    });

    it('should return the first type that matches', () => {
        const json: any = {
            one: 1,
            two: 2,
        };
        const multiDecoder: Decoder<{ one: number } | { two: number }> = decoder.OneOf2(
            decoder.Object({
                one: decoder.Number,
            }),
            decoder.Object({
                two: decoder.Number,
            })
        );
        const result: DecodeResult<{ one: number } | { two: number }> = multiDecoder.decode(json);

        expect(result).to.deep.equal({ one: 1 });
    });

    it('should return an error if none of the decoders apply', () => {
        const json: any = true;
        const oneOfDecoder: Decoder<number | string> = decoder.OneOf2(decoder.Number, decoder.String);
        const result: DecodeResult<number | string> = oneOfDecoder.decode(json);

        expect(result).to.be.an.instanceOf(Error);
    });

    it('should be able to match against multiple decoders', () => {
        const json: any = true;
        const oneOfDecoder: Decoder<number | string | boolean> = decoder.OneOf3(decoder.Number, decoder.String, decoder.Boolean);
        const result: DecodeResult<number | string | boolean> = oneOfDecoder.decode(json);

        expect(oneOfDecoder.decode(json)).to.equal(json);
    });
});
