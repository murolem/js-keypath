import { getValueAtAvailableKeyPath } from '$utils/keyPath/getValueAtAvailableKeyPath';
import { test, expect, describe } from 'vitest';

describe('first-level props', () => {
    test('non-existing property value retrieval results in a type error since the path does not exist', () => {
        const obj = {
            foo: 'hello'
        }

        // @ts-expect-error
        const result = getValueAtAvailableKeyPath(obj, 'fazbear');
    });
});