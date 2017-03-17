import { expect } from 'chai';

import {
    Decoder,
    DecodeResult,
} from "../lib/interface";
import { Number } from "../lib/number";
import {
    At,
    Dictionary,
    Struct,
} from "../lib/object";
import { String } from "../lib/string";
import * as generator from "./helper/generator";

const AnyDecoder: Decoder<any> = {
    decode(json: any): DecodeResult<any> {
        return json;
    },
};

describe("decoder.At", () => {
    const json: any = {
        levelOne: {
            levelTwo: 3,
        },
    };

    it("should return the decoded value at the nested path", () => {
        const atDecoder: Decoder<number> = At(['levelOne', 'levelTwo'], Number);
        const result: DecodeResult<number> = atDecoder.decode(json);

        expect(result).to.equal(json.levelOne.levelTwo);
    });

    it("should return an error if the path does not exist", () => {
        const atDecoder: Decoder<number> = At(['levelOne', 'levelThree'], Number);
        const result: DecodeResult<number> = atDecoder.decode(json);

        expect(result).to.be.an.instanceOf(Error);
    });

    it("should not suppress decode errors for contained values", () => {
        const atDecoder: Decoder<string> = At(['levelOne', 'levelTwo'], String);
        const result: DecodeResult<string> = atDecoder.decode(json);

        expect(result).to.be.an.instanceOf(Error);
    });
});

describe("decoder.Dictionary", () => {
    it("should correctly decode a dictionary", () => {
        const json: any = {
            "one": 1,
            "two": 2,
            "four": 4,
        };
        const dictDecoder: Decoder<{ [key: string]: number }> = Dictionary(Number);
        const result: DecodeResult<{ [key: string]: number }> = dictDecoder.decode(json);

        expect(result).to.deep.equal(json);
    });

    it("should return an error if a value can't be correctly decoded", () => {
        const json: any = {
            "one": 1,
            "two": "two",
        };
        const dictDecoder: Decoder<{ [key: string]: number }> = Dictionary(Number);
        const result: DecodeResult<{ [key: string]: number }> = dictDecoder.decode(json);

        expect(result).to.be.an.instanceOf(Error);
    });

    [
        {
            type: "boolean",
            values: generator.bool(2),
        },
        {
            type: "number",
            values: generator.number(100),
        },
        {
            type: "string",
            values: generator.string(100),
        },
        {
            type: "array",
            values: generator.array(100, generator.bool),
        },
    ].forEach(({ type, values }) => {
        it(`should return an error when given a ${type}`, () => {
            for (let testValue of values) {
                const result: DecodeResult<Object> = Dictionary(AnyDecoder).decode(testValue);

                expect(result).to.be.an.instanceOf(Error);
            }
        });
    });
});

describe("decoder.Struct", () => {
    it("should correctly decode a shaped object", () => {
        const json: any = {
            some: "value",
            has: 123,
        };
        const objDecoder: Decoder<{ some: string, has: number }> = Struct({
            some: String,
            has: Number,
        });
        const result: DecodeResult<{ some: string, has: number }> = objDecoder.decode(json);

        expect(result).to.deep.equal(json);
    });

    it("should return an error if a value can\'t be correctly decoded", () => {
        const json: any = {
            wrong: 'type',
        };
        const objDecoder: Decoder<{ wrong: number }> = Struct({
            wrong: Number,
        });
        const result: DecodeResult<{ wrong: number }> = objDecoder.decode(json);

        expect(result).to.be.an.instanceOf(Error);
    });

    [
        {
            type: "boolean",
            values: generator.bool(2),
        },
        {
            type: "number",
            values: generator.number(100),
        },
        {
            type: "string",
            values: generator.string(100),
        },
        {
            type: "array",
            values: generator.array(100, generator.bool),
        },
    ].forEach(({ type, values }) => {
        it(`should return an error when given a ${type}`, () => {
            for (let testValue of values) {
                const result: DecodeResult<Object> = Struct({}).decode(testValue);

                expect(result).to.be.an.instanceOf(Error);
            }
        });
    });
});
