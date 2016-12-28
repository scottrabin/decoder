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

describe('decoder.Map', () => {
    it('should apply the given function to the decoded result of the provided value', () => {
        const json: any = 8;
        const mapDecoder = decoder.Map(n => n.toString(), decoder.Number);

        expect(mapDecoder.decode(json)).to.equal('8');
    });

    it('should not suppress errors from the contained decoder', () => {
        const json: any = 12345;
        const mapDecoder = decoder.Map(v => parseInt(v, 10), decoder.String);

        expect(() => mapDecoder.decode(json)).to.throw(Error);
    });
});

describe('decoder.Dictionary', () => {
    it('should correctly decode a dictionary', () => {
        const json: any = {
            "one": 1,
            "two": 2,
            "four": 4,
        };

        const result = decoder.Dictionary(decoder.Number).decode(json);

        expect(result).to.deep.equal(json);
    });

    it('should throw an error if a value can\'t be correctly decoded', () => {
        const json: any = {
            "one": 1,
            "two": "two",
        };

        const dictDecoder = decoder.Dictionary(decoder.Number);

        expect(() => dictDecoder.decode(json)).to.throw(Error);
    });

    TEST_CASES.filter(testCase => testCase.type !== 'object').forEach(testCase => {
        it(`should error when given a ${testCase.type}`, () => {
            expect(() => decoder.Object({}).decode(testCase.value)).to.throw(Error);
        });
    });
});

describe('decoder.Maybe', () => {
    it('should return `null` when given `null` or an undefined value', () => {
        expect(decoder.Maybe(decoder.String).decode(null)).to.equal(null);
        expect(decoder.Maybe(decoder.Number).decode(void 0)).to.equal(null);
    });

    it('should return the decoded value if present', () => {
        const json: any = 3;

        expect(decoder.Maybe(decoder.Number).decode(json)).to.equal(json);
    });

    it('should not suppress decode errors for contained values', () => {
        const json: any = 'not a number';

        const maybeNumberDecoder = decoder.Maybe(decoder.Number);

        expect(() => maybeNumberDecoder.decode(json)).to.throw(Error);
    });
});

describe('decoder.At', () => {
    const json: any = {
        levelOne: {
            levelTwo: 3,
        },
    };

    it('should return the decoded value at the nested path', () => {
        const atDecoder = decoder.At(['levelOne', 'levelTwo'], decoder.Number);

        expect(atDecoder.decode(json)).to.equal(json.levelOne.levelTwo);
    });

    it('should throw an error if the path does not exist', () => {
        const atDecoder = decoder.At(['levelOne', 'levelThree'], decoder.Number);

        expect(() => atDecoder.decode(json)).to.throw(Error);
    });

    it('should not suppress decode errors for contained values', () => {
        const atDecoder = decoder.At(['levelOne', 'levelTwo'], decoder.String);

        expect(() => atDecoder.decode(json)).to.throw(Error);
    });
});

describe('decoder.OneOf', () => {
    it('should return the first type if it matches', () => {
        const json: any = 1;
        const oneOfDecoder = decoder.OneOf2(decoder.Number, decoder.String);

        expect(oneOfDecoder.decode(json)).to.equal(json);
    });

    it('should return the second type if it matches', () => {
        const json: any = 'one';
        const oneOfDecoder = decoder.OneOf2(decoder.Number, decoder.String);

        expect(oneOfDecoder.decode(json)).to.equal(json);
    });

    it('should return the first type that matches', () => {
        const json: any = {
            one: 1,
            two: 2,
        };

        const multiDecoder = decoder.OneOf2(
            decoder.Object({
                one: decoder.Number,
            }),
            decoder.Object({
                two: decoder.Number,
            })
        );

        expect(multiDecoder.decode(json)).to.deep.equal({ one: 1 });
    });

    it('should throw an error if none of the decoders apply', () => {
        const json: any = true;
        const oneOfDecoder = decoder.OneOf2(decoder.Number, decoder.String);

        expect(() => oneOfDecoder.decode(json)).to.throw(Error);
    });

    it('should be able to match against multiple decoders', () => {
        const json: any = true;
        const oneOfDecoder = decoder.OneOf3(decoder.Number, decoder.String, decoder.Boolean);

        expect(oneOfDecoder.decode(json)).to.equal(json);
    });
});
