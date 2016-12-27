import { expect } from 'chai';
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

describe('decoder.Boolean', () => {
    it('should correctly decode a boolean-valued JSON argument', () => {
        [true, false].forEach((bool: any) => {
            const result: boolean = decoder.Boolean.decode(bool);

            expect(result).to.be.equal(bool as boolean);
        });
    });

    TEST_CASES.filter(testCase => testCase.type !== 'boolean').forEach(testCase => {
        it(`should error when given a ${testCase.type}`, () => {
            expect(() => decoder.Boolean.decode(testCase.value)).to.throw(Error);
        });
    });
});

describe('decoder.Number', () => {
    it('should correctly decode a number-valued JSON argument', () => {
        [1, 30, 19837].forEach((num: any) => {
            const result: number = decoder.Number.decode(num);

            expect(result).to.be.equal(num as number);
        });
    });

    TEST_CASES.filter(testCase => testCase.type !== 'number').forEach(testCase => {
        it(`should error when given a ${testCase.type}`, () => {
            expect(() => decoder.Number.decode(testCase.value)).to.throw(Error);
        });
    });
});

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

describe('decoder.Array', () => {
    it('should correctly decode a array-valued JSON argument', () => {
        const json: any = ['one', 'two', 'three'];

        const result: Array<string> = decoder.Array(decoder.String).decode(json);

        expect(result).to.be.deep.equal(['one', 'two', 'three']);
    });

    it('should throw an error if an element is not decodeable with the given decoder', () => {
        const json: any = [1, 'two', 3];

        expect(() => decoder.Array(decoder.Number).decode(json)).to.throw(Error);
    });

    TEST_CASES.filter(testCase => testCase.type !== 'array').forEach(testCase => {
        it(`should error when given a ${testCase.type}`, () => {
            expect(() => decoder.Array(decoder.String).decode(testCase.value)).to.throw(Error);
        });
    });
});

describe('decoder.Object', () => {
    it('should correctly decode a shaped object', () => {
        const json: any = {
            some: 'value',
            has: 123,
        };

        const result = decoder.Object({
            some: decoder.String,
            has: decoder.Number,
        }).decode(json);

        expect(result).to.deep.equal(json);
    });

    it('should throw an error if a value can\'t be correctly decoded', () => {
        const json: any = {
            wrong: 'type',
        };

        const objDecoder = decoder.Object({
            wrong: decoder.Number,
        });

        expect(() => objDecoder.decode(json)).to.throw(Error);
    });

    TEST_CASES.filter(testCase => testCase.type !== 'object').forEach(testCase => {
        it(`should error when given a ${testCase.type}`, () => {
            expect(() => decoder.Object({}).decode(testCase.value)).to.throw(Error);
        });
    });
});
