import { test, describe, assertType, expectTypeOf } from 'vitest';
import type { KeyPath } from '$utils/keyPath/types/KeyPath';

describe('correct keypath generation for 1st-level props', () => {
    test('2 existing props, key path generated to each', () => {
        const obj: {
            foo: string,
            baz: string
        } = {
            foo: 'bar',
            baz: 'beemo'
        }

        type ObjKeyPath = KeyPath<typeof obj>;
        expectTypeOf<ObjKeyPath>().toEqualTypeOf<"foo" | "baz">();
    });

    test('1 existing and 1 optional prop, key path generated to each', () => {
        const obj: {
            foo: string,
            baz?: string
        } = {
            foo: 'bar',
            baz: 'beemo'
        }

        type ObjKeyPath = KeyPath<typeof obj>;
        expectTypeOf<ObjKeyPath>().toEqualTypeOf<"foo" | "baz">();
    });

    test('2 optional props, key path generated to each', () => {
        const obj: {
            foo?: string,
            baz?: string
        } = {
            foo: 'bar',
            baz: 'beemo'
        }

        type ObjKeyPath = KeyPath<typeof obj>;
        expectTypeOf<ObjKeyPath>().toEqualTypeOf<"foo" | "baz">();
    });

    test('no props, no key path is generated', () => {
        const obj = {};

        type ObjKeyPath = KeyPath<typeof obj>;
        expectTypeOf<ObjKeyPath>().toEqualTypeOf<never>();
    });
});

describe('correct keypath generation for 2nd-level props', () => {
    test('1 existing prop, key path generated to it', () => {
        const obj: {
            foo: string,
            baz: {
                boom: string
            }
        } = {
            foo: 'bar',
            baz: {
                boom: 'key'
            }
        }

        type ObjKeyPath = KeyPath<typeof obj>;
        expectTypeOf<ObjKeyPath>().toEqualTypeOf<"foo" | "baz" | "baz.boom">();
    });

    test('1 optional prop, key path generated to it', () => {
        const obj: {
            foo: string,
            baz: {
                boom?: string
            }
        } = {
            foo: 'bar',
            baz: {}
        }

        type ObjKeyPath = KeyPath<typeof obj>;
        expectTypeOf<ObjKeyPath>().toEqualTypeOf<"foo" | "baz" | "baz.boom">();
    });

    test('1 optional prop and the parent prop (1st-level) is optional too, key path generated to both', () => {
        const obj: {
            foo: string,
            baz?: {
                boom?: string
            }
        } = {
            foo: 'bar',
            baz: {}
        }

        type ObjKeyPath = KeyPath<typeof obj>;
        expectTypeOf<ObjKeyPath>().toEqualTypeOf<"foo" | "baz" | "baz.boom">();
    });
});

describe('other cases', () => {
    test('non-record prop results in type error', () => {
        // @ts-expect-error
        type T1 = KeyPath<number>
        // @ts-expect-error
        type T2 = KeyPath<string>
        // @ts-expect-error
        type T3 = KeyPath<any[]> // arr
        // @ts-expect-error
        type T4 = KeyPath<boolean>
        // @ts-expect-error
        type T5 = KeyPath<[string, number]> // tuple
        // @ts-expect-error
        type T6 = KeyPath<unknown>
        // @ts-expect-error
        type T7 = KeyPath<void>
        // @ts-expect-error
        type T8 = KeyPath<null>
        // @ts-expect-error
        type T9 = KeyPath<undefined>
        // @ts-expect-error
        type T10 = KeyPath<object>
    });
});

