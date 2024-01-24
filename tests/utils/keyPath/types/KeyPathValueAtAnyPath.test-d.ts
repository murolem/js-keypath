import { test, describe, assertType, expectTypeOf } from 'vitest';
import type { KeyPathValueAtAnyPath } from '$utils/keyPath/types/KeyPathValueAtAnyPath';

describe('extracting type of the 1st-level props', () => {
    test('lookup of an existing prop, results in that prop value type', () => {
        const obj = {
            foo: 'bar'
        }

        type ObjKeyPathValueValue = KeyPathValueAtAnyPath<typeof obj, 'foo'>;
        expectTypeOf<ObjKeyPathValueValue>().toEqualTypeOf<string>();
    });

    test('lookup of an optional prop, results in that prop value type | undefined', () => {
        const obj: {
            baz?: string
        } = {
            baz: 'beemo'
        }

        type ObjKeyPathValue = KeyPathValueAtAnyPath<typeof obj, 'baz'>;
        expectTypeOf<ObjKeyPathValue>().toEqualTypeOf<string | undefined>();
    });

    test('lookup of an non-existing prop, results in undefined', () => {
        const obj = {
            foo: 'bar'
        }

        type ObjKeyPathValueValue = KeyPathValueAtAnyPath<typeof obj, 'baz'>;
        expectTypeOf<ObjKeyPathValueValue>().toEqualTypeOf<undefined>();
    });
});

describe('extracting type of the 2nd-level props', () => {
    test('lookup of an existing prop, results in that prop value type', () => {
        const obj: {
            foo: string,
            baz: {
                boom: number
            }
        } = {
            foo: 'bar',
            baz: {
                boom: 123
            }
        }

        type ObjKeyPathValue = KeyPathValueAtAnyPath<typeof obj, 'baz.boom'>;
        expectTypeOf<ObjKeyPathValue>().toEqualTypeOf<number>();
    });

    test('lookup of an optional prop, results in that prop value type | undefined', () => {
        const obj: {
            foo: string,
            baz: {
                boom?: number
            }
        } = {
            foo: 'bar',
            baz: {}
        }

        type ObjKeyPathValue = KeyPathValueAtAnyPath<typeof obj, 'baz.boom'>;
        expectTypeOf<ObjKeyPathValue>().toEqualTypeOf<number | undefined>();
    });

    test('lookup of an non-existing prop, results in undefined', () => {
        const obj: {
            foo: string,
            baz: {
            }
        } = {
            foo: 'bar',
            baz: {}
        }

        type ObjKeyPathValue = KeyPathValueAtAnyPath<typeof obj, 'baz.boom'>;
        expectTypeOf<ObjKeyPathValue>().toEqualTypeOf<undefined>();
    });

    test('lookup of an optional prop with optional parent prop, results in that prop value type | undefined', () => {
        const obj: {
            foo: string,
            baz?: {
                boom?: number
            }
        } = {
            foo: 'bar',
            baz: {}
        }

        type ObjKeyPathValue = KeyPathValueAtAnyPath<typeof obj, 'baz.boom'>;
        expectTypeOf<ObjKeyPathValue>().toEqualTypeOf<number | undefined>();
    });

    test('lookup of some prop with parent prop being non-record results in never', () => {
        const obj: {
            foo: string,
            baz: number
        } = {
            foo: 'bar',
            baz: 123
        }

        type ObjKeyPathValue = KeyPathValueAtAnyPath<typeof obj, 'baz.boom'>;
        expectTypeOf<ObjKeyPathValue>().toEqualTypeOf<never>();
    });
});

describe('passing different type args', () => {
    test('non-record prop results in a type error', () => {
        // @ts-expect-error
        type T1 = KeyPathValueAtAnyPath<number, 'foo'>
        // @ts-expect-error
        type T2 = KeyPathValueAtAnyPath<string, 'foo'>
        // @ts-expect-error
        type T3 = KeyPathValueAtAnyPath<any[], 'foo'> // arr
        // @ts-expect-error
        type T4 = KeyPathValueAtAnyPath<boolean, 'foo'>
        // @ts-expect-error
        type T5 = KeyPathValueAtAnyPath<[string, number], 'foo'> // tuple
        // @ts-expect-error
        type T6 = KeyPathValueAtAnyPath<unknown, 'foo'>
        // @ts-expect-error
        type T7 = KeyPathValueAtAnyPath<void, 'foo'>
        // @ts-expect-error
        type T8 = KeyPathValueAtAnyPath<null, 'foo'>
        // @ts-expect-error
        type T9 = KeyPathValueAtAnyPath<undefined, 'foo'>
        // @ts-expect-error
        type T10 = KeyPathValueAtAnyPath<object, 'foo'>
    });

    test('non-string paths result in a type error', () => {
        // @ts-expect-error
        type T1 = KeyPathValueAtAnyPath<{}, number>
        // no error
        type T2 = KeyPathValueAtAnyPath<{}, string>
        // @ts-expect-error
        type T3 = KeyPathValueAtAnyPath<{}, any[]> // arr
        // @ts-expect-error
        type T4 = KeyPathValueAtAnyPath<{}, boolean>
        // @ts-expect-error
        type T5 = KeyPathValueAtAnyPath<{}, [string, number]> // tuple
        // @ts-expect-error
        type T6 = KeyPathValueAtAnyPath<{}, unknown>
        // @ts-expect-error
        type T7 = KeyPathValueAtAnyPath<{}, void>
        // @ts-expect-error
        type T8 = KeyPathValueAtAnyPath<{}, null>
        // @ts-expect-error
        type T9 = KeyPathValueAtAnyPath<{}, undefined>
        // @ts-expect-error
        type T10 = KeyPathValueAtAnyPath<{}, object>
    });
});