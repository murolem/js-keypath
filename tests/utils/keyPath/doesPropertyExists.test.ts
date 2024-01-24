import { doesKeyPathPropertyExists } from '$utils/keyPath/doesKeyPathPropertyExists';
import { test, expect, describe } from 'vitest';


describe('first-level props', () => {
    test('checking existing property', () => {
        const obj = {
            foo: 'hello'
        }

        const result = doesKeyPathPropertyExists(obj, 'foo');

        //

        expect(result).toStrictEqual(true);
    });

    test('checking non-existing property', () => {
        const obj: {
            foo: string,
            bar?: number
        } = {
            foo: 'hello'
        }

        const result = doesKeyPathPropertyExists(obj, 'bar');

        //

        expect(result).toStrictEqual(false);
    });
});

describe('second-level props', () => {
    test('checking existing property', () => {
        const obj = {
            foo: 'hello',
            bar: {
                baz: 'meow'
            }
        }

        const result = doesKeyPathPropertyExists(obj, 'bar.baz');

        //

        expect(result).toStrictEqual(true);
    });

    test('checking non-existing property', () => {
        const obj = {
            foo: 'hello',
            bar: {
                baz: 'meow'
            }
        }

        const result = doesKeyPathPropertyExists(obj, 'bar.beemo');

        //

        expect(result).toStrictEqual(false);
    });
});