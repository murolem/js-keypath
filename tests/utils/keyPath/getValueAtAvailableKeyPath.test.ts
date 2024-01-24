import { getValueAtAvailableKeyPath } from '$utils/keyPath/getValueAtAvailableKeyPath';
import { test, expect, describe } from 'vitest';

describe('first-level props', () => {
    test('existing property value is retrieved', () => {
        const obj = {
            foo: 'hello'
        }

        const result = getValueAtAvailableKeyPath(obj, 'foo');

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        expect(result.value).toStrictEqual('hello');
    });

    test('optional non-existing property value is not retrieved, since it does not exist, resulting in a failure return', () => {
        const obj: {
            foo: string,
            bar?: number
        } = {
            foo: 'hello'
        }

        const result = getValueAtAvailableKeyPath(obj, 'bar');

        //

        expect(result.success).toStrictEqual(false);
        if (result.success) throw new Error(); // alows to access success return props below

        expect(result.reason).toStrictEqual('missing-property-encountered' as typeof result['reason']);

        expect(result.traversedPath).toStrictEqual('');
    });
});

describe('second-level props', () => {
    // target props

    test('existing property value is retrieved', () => {
        const obj = {
            foo: 'hello',
            bar: {
                baz: 'kiki'
            }
        }

        const result = getValueAtAvailableKeyPath(obj, 'bar.baz');

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        expect(result.value).toStrictEqual('kiki');
    });

    test('optional non-existing property value is not retrieved, since it does not exist, resulting in a failure return', () => {
        const obj: {
            foo: string,
            bar?: {
                george: string,
                baz?: number
            }
        } = {
            foo: 'hello',
            bar: {
                george: 'maria'
            }
        }

        const result = getValueAtAvailableKeyPath(obj, 'bar.baz');

        //

        expect(result.success).toStrictEqual(false);
        if (result.success) throw new Error(); // alows to access success return props below

        expect(result.reason).toStrictEqual('missing-property-encountered' as typeof result['reason']);

        expect(result.traversedPath).toStrictEqual('bar');
    });

    test('the value of an optional non-existing prop with non-existing parent prop is not retrieved, since the parent prop does not exist, resulting in a failure return', () => {
        const obj: {
            foo: string,
            bar?: {
                george: string,
                baz?: number
            }
        } = {
            foo: 'hello',
        }

        const result = getValueAtAvailableKeyPath(obj, 'bar.baz');

        //

        expect(result.success).toStrictEqual(false);
        if (result.success) throw new Error(); // alows to access success return props below

        expect(result.reason).toStrictEqual('missing-property-encountered' as typeof result['reason']);

        expect(result.traversedPath).toStrictEqual('');
    });
});