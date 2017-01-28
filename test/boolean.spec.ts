import { expect } from 'chai';

import { DecodeResult } from "../lib/interface";
import { Boolean } from "../lib/boolean";
import * as generator from "./helper/generator";

describe("decoder.Boolean", () => {
    it("should correctly decode a boolean-valued JSON argument", () => {
        for (let testValue of generator.bool(2)) {
            const result: DecodeResult<boolean> = Boolean.decode(testValue);

            expect(result).to.be.equal(testValue);
        }
    });

    [
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
        {
            type: "object",
            values: generator.object(100, generator.string),
        },
    ].forEach(({ type, values }) => {
        it(`should return an error when given a ${type}`, () => {
            for (let testValue of values) {
                const result: DecodeResult<boolean> = Boolean.decode(testValue);

                expect(result).to.be.an.instanceOf(Error);
            }
        });
    });
});
