import { expect } from 'chai';
import * as decoder from '../lib/index';

const TEST_CASES = [
    {
        type: 'number',
        value: 12345,
    },
    {
        type: 'boolean',
        value: true,
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

describe('decoder.String', () => {
    it('should correctly decode a string-valued JSON argument', () => {
        const json: any = 'a valid string';

        const result: string = decoder.String.decode(json);

        expect(result).to.be.equal('a valid string');
    });

    TEST_CASES.filter(testCase => testCase.type !== 'string').forEach(testCase => {
        it(`should error when given a ${testCase.type}`, () => {
            expect(() => decoder.String.decode(testCase.value)).to.throw(Error);
        });
    });
});
