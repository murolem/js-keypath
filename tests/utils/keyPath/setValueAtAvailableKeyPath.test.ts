import { setValueAtAvailableKeyPath } from '$utils/keyPath/setValueAtAvailableKeyPath';
import { test, expect, describe, expectTypeOf } from 'vitest';

describe('first-level props', () => {
    test('existing property value is set', () => {
        const obj = {
            foo: 'hello'
        }

        const result = setValueAtAvailableKeyPath(obj, 'foo', 'bye');

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        expect(obj['foo']).toStrictEqual('bye');

        expect(result.record).toStrictEqual(obj);
    });

    test('attempt to set a non-existing property, defined in the record type (optional prop), with the replace missing props set to TRUE BY DEFAULT is successful, since the path is available', () => {
        const obj: {
            foo: string,
            bar?: number
        } = {
            foo: 'hello'
        }

        const result = setValueAtAvailableKeyPath(obj, 'bar', 123);

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        expect(obj['bar']).toStrictEqual(123);

        expect(result.record).toStrictEqual(obj);
    });

    test('attempt to set a non-existing property, defined in the record type (optional prop), with the replace missing props set to FALSE is successful, since the prop is at the end of the path', () => {
        const obj: {
            foo: string,
            bar?: number
        } = {
            foo: 'hello'
        }

        const result = setValueAtAvailableKeyPath(obj, 'bar', 123, { createMissingProperties: false });

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        expect(obj['bar']).toStrictEqual(123);

        expect(result.record).toStrictEqual(obj);
    });
});

describe('second-level props', () => {
    // target props

    test('existing property value is set', () => {
        const obj = {
            foo: 'hello',
            bar: {
                baz: 'kiki'
            }
        }

        const result = setValueAtAvailableKeyPath(obj, 'bar.baz', 'bouba');

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        expect(obj.bar.baz).toStrictEqual('bouba');

        expect(result.record).toStrictEqual(obj);
    });

    test('attempt to set a non-existing property, defined in the record type (optional prop), with the replace missing props set to TRUE BY DEFAULT is successful, since the path is available', () => {
        const obj: {
            foo: string,
            bar: {
                baz: string,
                bouba?: string
            }
        } = {
            foo: 'hello',
            bar: {
                baz: 'kiki',
            }
        }

        const result = setValueAtAvailableKeyPath(obj, 'bar.bouba', '123');

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        expect(obj['bar']).toStrictEqual(123);

        expect(result.record).toStrictEqual(obj);
    });

    test('attempt to set a non-existing property, defined in the record type (optional prop), with the replace missing props set to FALSE is successful, since the prop is at the end of the path', () => {
        const obj: {
            foo: string,
            bar: {
                baz: string,
                bouba?: string
            }
        } = {
            foo: 'hello',
            bar: {
                baz: 'kiki',
            }
        }

        const result = setValueAtAvailableKeyPath(obj, 'bar.bouba', '123', { createMissingProperties: false });

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        expect(obj['bar']).toStrictEqual(123);

        expect(result.record).toStrictEqual(obj);
    });

    test('non-existing PARENT property, which is defined as optional in the record type, is created when the create missing properties option is TRUE BY DEFAULT', () => {
        const obj: {
            foo: string,
            bar?: {
                baz: string,
                bouba?: string
            }
        } = {
            foo: 'hello'
        }

        const result = setValueAtAvailableKeyPath(obj, 'bar.baz', 'bimbo', { createMissingProperties: true });

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        expect(obj.bar?.baz).toStrictEqual('bimbo');

        expect(result.record).toStrictEqual(obj);
    });

    test('non-existing PARENT property, which is defined as optional in the record type, is NOT created when the create missing properties option is FALSE', () => {
        const obj: {
            foo: string,
            bar?: {
                baz: string,
                bouba?: string
            }
        } = {
            foo: 'hello'
        }

        const result = setValueAtAvailableKeyPath(obj, 'bar.baz', 'bimbo', { createMissingProperties: false });

        //  fsddasd

        expect(result.success).toStrictEqual(false);
        if (result.success) throw new Error(); // alows to access success return props below

        expect(result.reason).toStrictEqual('missing-property-encountered' as typeof result['reason']);
        expect(result.traversedPath).toStrictEqual('fsdfsdfsdfsd');
    });
});