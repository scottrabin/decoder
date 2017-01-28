import { expect } from 'chai';

import { Array } from "../lib/array";
import {
    Decoder,
    DecodeResult,
} from "../lib/interface";
import * as generator from "./helper/generator";

const AnyDecoder: Decoder<any> = {
    decode(json: any): any {
        return json;
    },
};

describe("decoder.Array", () => {
    it("should correctly decode a array-valued JSON argument", () => {
        for (let testValue of generator.array(25, generator.number)) {
            const result: DecodeResult<Array<any>> = Array(AnyDecoder).decode(testValue);

            expect(result).to.be.deep.equal(testValue);
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
            type: "string",
            values: generator.string(100),
        },
        {
            type: "object",
            values: generator.object(100, generator.string),
        },
    ].forEach(({ type, values }) => {
        it(`should return an error when given a ${type}`, () => {
            for (let testValue of values) {
                const result: DecodeResult<Array<any>> = Array(AnyDecoder).decode(testValue);

                expect(result).to.be.an.instanceOf(Error);
            }
        });
    });
});
