import { expect } from "chai";
import * as moment from "moment";

import { DecodeResult } from "../lib/interface";
import { Date } from "../lib/date";
import { GlobalDate } from "../lib/unshadow";
import * as generator from "./helper/generator";

describe("decoder.Date", () => {
    it("should correctly decode epoch dates", () => {
        for (let testValue of generator.date(25)) {
            const result: DecodeResult<GlobalDate> = Date.decode(testValue.getTime());

            expect(result).to.be.deep.equal(testValue);
        }
    });

    it("should correctly decode RFC2822 dates", () => {
        for (let testValue of generator.date(25)) {
            // strip the fractional seconds, which are not represented by RFC 2822
            testValue.setSeconds(testValue.getSeconds(), 0);
            const rfc2822String = moment(testValue).format("ddd, DD MMM YYYY HH:mm:ss ZZ");
            const result: DecodeResult<GlobalDate> = Date.decode(rfc2822String);

            expect(result).to.be.deep.equal(testValue);
        }
    });

    it("should correctly decode ISO 8601 dates", () => {
        for (let testValue of generator.date(25)) {
            const result: DecodeResult<GlobalDate> = Date.decode(testValue.toISOString());

            expect(result).to.be.deep.equal(testValue);
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
                const result: DecodeResult<GlobalDate> = Date.decode(testValue);

                expect(result).to.be.an.instanceOf(Error);
            }
        });
    });
});
