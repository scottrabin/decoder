import * as Faker from 'faker';

function makeTestCases<T>(
    count: number,
    generator: (index: number) => T
): Array<T> {
    const result: Array<T> = new Array(count);
    for (let i = 0; i < count; i++) {
        result[i] = generator(i);
    }
    return result;
}

export function bool(count: number): Array<boolean> {
    return makeTestCases(count, i => i % 2 === 0);
}

export function number(count: number): Array<number> {
    return makeTestCases(count, () => Faker.random.number());
}

export function string(count: number): Array<string> {
    return makeTestCases(count, () => Faker.lorem.word());
}

export function array<T>(count: number, generator: (count: number) => Array<T>): Array<Array<T>> {
    return makeTestCases(count, () => generator(Faker.random.number({
        min: 3,
        max: 8,
    })));
}

export function object<T>(count: number, generator: (index?: number) => T): Array<{ [key: string]: T }> {
    return makeTestCases(count, (i) => {
        const result: { [key: string]: T } = {};
        const propCount = Faker.random.number({
            min: 3,
            max: 8,
        });
        for (let i = 0; i < propCount; i++) {
            result[Faker.lorem.word()] = generator(i);
        }
        return result;
    });
}
