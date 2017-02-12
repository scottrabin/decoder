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
