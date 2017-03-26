import { expect } from 'chai';

import { DecodeError } from "../lib/decode-error";
import {
    Decoder,
    DecodeResult,
} from "../lib/interface";
import { Equal } from "../lib/equal";
import * as generator from "./helper/generator";

describe("decoder.Equal", () => {
    it("should assert the decoded value is equal to the provided boolean value", () => {
        const values = generator.bool(2);
        for (let value of values) {
            const equalDecoder: Decoder<boolean> = Equal(value);
            const result: DecodeResult<boolean> = equalDecoder.decode(value);

            expect(result).to.equal(value);
        }
    });

    it("should assert the decoded value is equal to the provided number value", () => {
        const values = generator.number(100);
        for (let value of values) {
            const equalDecoder: Decoder<number> = Equal(value);
            const result: DecodeResult<number> = equalDecoder.decode(value);

            expect(result).to.equal(value);
        }
    });

    it("should assert the decoded value is equal to the provided string value", () => {
        const values = generator.string(100);
        for (let value of values) {
            const equalDecoder: Decoder<string> = Equal(value);
            const result: DecodeResult<string> = equalDecoder.decode(value);

            expect(result).to.equal(value);
        }
    });

    it("should return an error when the decoded value is not equal to the provided value", () => {
        const equalDecoder: Decoder<number> = Equal(1);
        const result: DecodeResult<number> = equalDecoder.decode("1");

        expect(result).to.be.an.instanceOf(Error);
    });
});
