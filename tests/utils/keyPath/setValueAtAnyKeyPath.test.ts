import { setValueAtAnyKeyPath } from '$utils/keyPath/setValueAtAnyKeyPath';
import { test, expect, describe } from 'vitest';

describe('first-level props', () => {
    test('existing property value is set', () => {
        const obj = {
            foo: 'hello'
        }

        const result = setValueAtAnyKeyPath(obj, 'foo', 'bye');

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        expect(obj['foo']).toStrictEqual('bye');

        expect(result.record).toStrictEqual(obj);
    });

    test('non-existing property value is set', () => {
        const obj = {
            foo: 'hello'
        }

        const result = setValueAtAnyKeyPath(obj, 'fazbear', 'five bear');

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        // @ts-expect-error
        expect(obj['fazbear']).toStrictEqual('five bear');

        expect(result.record).toStrictEqual(obj);
    });


    test('non-existing property value is set when the create missing properties option is FALSE, since its the last property on the path', () => {
        const obj = {
            foo: 'hello'
        }

        const result = setValueAtAnyKeyPath(obj, 'fazbear', 'five bear', { createMissingProperties: false });

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        // @ts-expect-error
        expect(obj['fazbear']).toStrictEqual('five bear');

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

        const result = setValueAtAnyKeyPath(obj, 'bar.baz', 'bouba');

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        expect(obj.bar.baz).toStrictEqual('bouba');

        expect(result.record).toStrictEqual(obj);
    });

    test('non-existing property value is set', () => {
        const obj = {
            foo: 'hello',
            bar: {
                george: 'maria'
            }
        }

        const result = setValueAtAnyKeyPath(obj, 'bar.baz', 'bouba');

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        // @ts-expect-error
        expect(obj.bar.baz).toStrictEqual('bouba');

        expect(result.record).toStrictEqual(obj);
    });

    test('non-existing property value is set when the create missing properties option is FALSE, since its the last property on the path', () => {
        const obj = {
            foo: 'hello',
            bar: {
                george: 'maria'
            }
        }

        const result = setValueAtAnyKeyPath(obj, 'bar.baz', 'bouba');

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        // @ts-expect-error
        expect(obj.bar.baz).toStrictEqual('bouba');

        expect(result.record).toStrictEqual(obj);
    });

    // parent props

    test('non-existing PARENT property is created when the create missing properties option is TRUE BY DEFAULT)', () => {
        const obj = {
            foo: 'hello'
        }

        const result = setValueAtAnyKeyPath(obj, 'bar.baz', 'bouba');

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        // @ts-expect-error
        expect(obj.bar.baz).toStrictEqual('bouba');

        expect(result.record).toStrictEqual(obj);
    });

    test('non-existing PARENT property is NOT created when the create missing properties option is FALSE', () => {
        const obj = {
            foo: 'hello',
        }

        const result = setValueAtAnyKeyPath(obj, 'bar.baz', 'bouba', { createMissingProperties: false });

        //

        expect(result.success).toStrictEqual(false);
        if (result.success) throw new Error(); // alows to access success return props below

        expect(result.reason).toStrictEqual('missing-property-encountered' as typeof result['reason']);
        expect(result.traversedPath).toStrictEqual('');
    });

    test('existing PARENT property is NOT replaced when it\'s not a record and the replace existing properties option is FALSE BY DEFAULT', () => {
        const obj = {
            foo: 'hello',
            bar: 123
        }

        const result = setValueAtAnyKeyPath(obj, 'bar.baz', 'bouba');

        //

        expect(result.success).toStrictEqual(false);
        if (result.success) throw new Error(); // alows to access success return props below

        expect(result.reason).toStrictEqual('non-record-property-encountered' as typeof result['reason']);
        expect(result.traversedPath).toStrictEqual('');
    });

    test('existing PARENT property is replaced when it\'s not a record and the replace existing properties option is TRUE', () => {
        const obj = {
            foo: 'hello',
            bar: 123
        }

        const result = setValueAtAnyKeyPath(obj, 'bar.baz', 'bouba', { replaceExistingProperties: true });

        //

        expect(result.success).toStrictEqual(true);
        if (!result.success) throw new Error(); // alows to access success return props below

        // @ts-expect-error
        expect(obj.bar.baz).toStrictEqual('bouba');

        expect(result.record).toStrictEqual(obj);
    });
});

describe('third-level props', () => {
    // here testing the traversed path, since the same test for the second-level has an empty traversed path
    test('non-existing PARENT property is NOT created when the create missing properties option is FALSE', () => {
        const obj = {
            foo: 'hello',
            bar: {
                goomba: 'jake'
            }
        }

        const result = setValueAtAnyKeyPath(obj, 'bar.baz.bingo', 'bouba', { createMissingProperties: false });

        //

        expect(result.success).toStrictEqual(false);
        if (result.success) throw new Error(); // alows to access success return props below

        expect(result.reason).toStrictEqual('missing-property-encountered' as typeof result['reason']);
        expect(result.traversedPath).toStrictEqual('bar');
    });
})

describe('edge cases', () => {
    test('an empty path results in a failure return', () => {
        const obj = {
            foo: 'hello',
            bar: {
                baz: 'kiki'
            }
        }

        const result = setValueAtAnyKeyPath(obj, '', 'bouba');

        //

        expect(result.success).toStrictEqual(false);
        if (result.success) throw new Error(); // alows to access success return props below

        expect(result.reason).toStrictEqual('empty-path-provided' as typeof result['reason']);
        expect(result.traversedPath).toStrictEqual('');
    });
});