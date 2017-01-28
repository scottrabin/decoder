import { expect } from 'chai';

import { DecodeResult } from "../lib/interface";
import { Number } from "../lib/number";
import * as generator from "./helper/generator";

describe("decoder.Number", () => {
    it("should correctly decode a number-valued JSON argument", () => {
        for (let testValue of generator.number(25)) {
            const result: DecodeResult<number> = Number.decode(testValue);

            expect(result).to.be.equal(testValue);
        }
    });

    [
        {
            type: "boolean",
            values: generator.bool(2),
        },
        {
            type: "string",
            values: generator.string(100),
        },
        {
            type: "array",
            values: generator.array(100, generator.bool),
        },
        {
            type: "object",
            values: generator.object(100, generator.string),
        },
    ].forEach(({ type, values }) => {
        it(`should return an error when given a ${type}`, () => {
            for (let testValue of values) {
                const result: DecodeResult<number> = Number.decode(testValue);

                expect(result).to.be.an.instanceOf(Error);
            }
        });
    });
});
