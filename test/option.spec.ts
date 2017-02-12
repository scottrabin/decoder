import { expect } from 'chai';
import * as Faker from 'faker';

import { DecodeError } from "../lib/decode-error";
import {
    Decoder,
    DecodeResult,
} from "../lib/interface";
import {
    Default,
    Maybe,
} from "../lib/option";

const SuccessDecoder: Decoder<any> = {
    decode(json: any) {
        return json;
    },
};

const FailDecoder: Decoder<any> = {
    decode(json: any) {
        return new DecodeError("intentionally errored", json);
    },
};

describe("decoder.Maybe", () => {
    it("should return `null` when given `null` or an undefined value", () => {
        const maybeDecoder: Decoder<null | string> = Maybe(SuccessDecoder);

        expect(maybeDecoder.decode(null)).to.equal(null);
        expect(maybeDecoder.decode(void 0)).to.equal(null);
        expect(maybeDecoder.decode(undefined)).to.equal(null);
    });

    it("should return the decoded value if present", () => {
        const json: any = 3;
        const maybeDecoder: Decoder<null | number> = Maybe(SuccessDecoder);
        const result: DecodeResult<null | number> = maybeDecoder.decode(json);

        expect(result).to.equal(json);
    });

    it('should not suppress decode errors for contained values', () => {
        const json: any = 'not a number';
        const maybeNumberDecoder: Decoder<null | number> = Maybe(FailDecoder);
        const result: DecodeResult<null | number> = maybeNumberDecoder.decode(json);

        expect(result).to.be.an.instanceOf(Error);
    });
});

describe('decoder.Default', () => {
    it('should return the provided default value if the given value is `null`', () => {
        const json: any = null;
        const defaultValue: number = Faker.random.number();
        const defaultDecoder: Decoder<number> = Default(SuccessDecoder, defaultValue);
        const result: DecodeResult<number> = defaultDecoder.decode(json);

        expect(result).to.equal(defaultValue);
    });

    it('should return the provided default value if the given value is `undefined`', () => {
        const json: any = void 0;
        const defaultDecoder: Decoder<boolean> = Default(SuccessDecoder, true);
        const result: DecodeResult<boolean> = defaultDecoder.decode(json);

        expect(result).to.equal(true);
    })

    it('should return the decoded value if the given argument is non-null', () => {
        const json: any = 'a string';
        const defaultValue: string = 'default value';
        const defaultDecoder: Decoder<string> = Default(SuccessDecoder, defaultValue);
        const result: DecodeResult<string> = defaultDecoder.decode(json);

        expect(result).to.equal(json);
    });
});
