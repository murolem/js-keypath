import { setValueAtAvailableKeyPath } from '$utils/keyPath/setValueAtAvailableKeyPath';
import { test, expect, describe, expectTypeOf } from 'vitest';

describe('first-level props', () => {
    test('attempt to set a non-existing property, NOT defined in the record type, results in a type error, since the path to it is not available', () => {
        const obj = {
            foo: 'hello'
        }

        // @ts-expect-error
        const fn = () => setValueAtAvailableKeyPath(obj, 'fazbear', 'five bear');
    });
});

describe('second-level props', () => {
    test('attempt to set a non-existing property, NOT defined in the record type, results in a type error, since the path to it is not available', () => {
        const obj = {
            foo: 'hello',
            bar: {
                baz: 'kiki'
            }
        }

        // @ts-expect-error
        const fn = () => setValueAtAvailableKeyPath(obj, 'bar.boom', 'five bear');
    });
});

describe('edge cases', () => {
    test('an empty path results in a type error', () => {
        const obj = {
            foo: 'hello',
            bar: {
                baz: 'kiki'
            }
        }

        // @ts-expect-error
        const resultFn = () => setValueAtAvailableKeyPath(obj, '', 'bouba');
    });
});