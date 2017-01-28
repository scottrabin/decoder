import { expect } from 'chai';

import { DecodeResult } from "../lib/interface";
import { String } from "../lib/String";
import * as generator from "./helper/generator";

describe("decoder.String", () => {
    it("should correctly decode a string-valued JSON argument", () => {
        for (let testValue of generator.string(25)) {
            const result: DecodeResult<string> = String.decode(testValue);

            expect(result).to.be.equal(testValue);
        }
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
                const result: DecodeResult<string> = String.decode(testValue);

                expect(result).to.be.an.instanceOf(Error);
            }
        });
    });
});
