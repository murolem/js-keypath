import { KeyPathValueAtAvailablePath } from '$utils/keyPath/types/KeyPathValueAtAvailablePath';
import { test, describe, assertType, expectTypeOf } from 'vitest';

describe('extracting type of the 1st-level props', () => {
    test('lookup of an existing prop, results in that prop value type', () => {
        const obj = {
            foo: 'bar'
        }

        type ObjKeyPathValueValue = KeyPathValueAtAvailablePath<typeof obj, 'foo'>;
        expectTypeOf<ObjKeyPathValueValue>().toEqualTypeOf<string>();
    });

    test('lookup of an optional prop, results in that prop value type | undefined', () => {
        const obj: {
            baz?: string
        } = {
            baz: 'beemo'
        }

        type ObjKeyPathValue = KeyPathValueAtAvailablePath<typeof obj, 'baz'>;
        expectTypeOf<ObjKeyPathValue>().toEqualTypeOf<string | undefined>();
    });

    test('lookup of an non-existing prop, results in a type error', () => {
        const obj = {
            foo: 'bar'
        }

        // @ts-expect-error
        type ObjKeyPathValueValue = KeyPathValueAtAvailablePath<typeof obj, 'baz'>;
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

        type ObjKeyPathValue = KeyPathValueAtAvailablePath<typeof obj, 'baz.boom'>;
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

        type ObjKeyPathValue = KeyPathValueAtAvailablePath<typeof obj, 'baz.boom'>;
        expectTypeOf<ObjKeyPathValue>().toEqualTypeOf<number | undefined>();
    });

    test('lookup of an non-existing prop, results in a type error', () => {
        const obj: {
            foo: string,
            baz: {
            }
        } = {
            foo: 'bar',
            baz: {}
        }

        // @ts-expect-error
        type ObjKeyPathValue = KeyPathValueAtAvailablePath<typeof obj, 'baz.boom'>;
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

        type ObjKeyPathValue = KeyPathValueAtAvailablePath<typeof obj, 'baz.boom'>;
        expectTypeOf<ObjKeyPathValue>().toEqualTypeOf<number | undefined>();
    });

    test('lookup of some prop with parent prop being non-record results in a type error', () => {
        const obj: {
            foo: string,
            baz: number
        } = {
            foo: 'bar',
            baz: 123
        }

        // @ts-expect-error
        type ObjKeyPathValue = KeyPathValueAtAvailablePath<typeof obj, 'baz.boom'>;
    });
});

describe('passing different type args', () => {
    test('non-record prop results in a type error', () => {
        // @ts-expect-error
        type T1 = KeyPathValueAtAvailablePath<number, 'foo'>
        // @ts-expect-error
        type T2 = KeyPathValueAtAvailablePath<string, 'foo'>
        // @ts-expect-error
        type T3 = KeyPathValueAtAvailablePath<any[], 'foo'> // arr
        // @ts-expect-error
        type T4 = KeyPathValueAtAvailablePath<boolean, 'foo'>
        // @ts-expect-error
        type T5 = KeyPathValueAtAvailablePath<[string, number], 'foo'> // tuple
        // @ts-expect-error
        type T6 = KeyPathValueAtAvailablePath<unknown, 'foo'>
        // @ts-expect-error
        type T7 = KeyPathValueAtAvailablePath<void, 'foo'>
        // @ts-expect-error
        type T8 = KeyPathValueAtAvailablePath<null, 'foo'>
        // @ts-expect-error
        type T9 = KeyPathValueAtAvailablePath<undefined, 'foo'>
        // @ts-expect-error
        type T10 = KeyPathValueAtAvailablePath<object, 'foo'>
    });

    test('non-keypath types result in a type error', () => {
        // @ts-expect-error
        type T1 = KeyPathValueAtAvailablePath<{}, number>
        // @ts-expect-error
        type T2 = KeyPathValueAtAvailablePath<{}, string>
        // @ts-expect-error
        type T3 = KeyPathValueAtAvailablePath<{}, any[]> // arr
        // @ts-expect-error
        type T4 = KeyPathValueAtAvailablePath<{}, boolean>
        // @ts-expect-error
        type T5 = KeyPathValueAtAvailablePath<{}, [string, number]> // tuple
        // @ts-expect-error
        type T6 = KeyPathValueAtAvailablePath<{}, unknown>
        // @ts-expect-error
        type T7 = KeyPathValueAtAvailablePath<{}, void>
        // @ts-expect-error
        type T8 = KeyPathValueAtAvailablePath<{}, null>
        // @ts-expect-error
        type T9 = KeyPathValueAtAvailablePath<{}, undefined>
        // @ts-expect-error
        type T10 = KeyPathValueAtAvailablePath<{}, object>
    });
});