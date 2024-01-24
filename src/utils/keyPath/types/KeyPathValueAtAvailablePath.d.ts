import { KeyPath } from '$utils/keyPath/types/KeyPath';
import { KeyPathValueAtAnyPath } from '$utils/keyPath/types/KeyPathValueAtAnyPath';

/**
 * Lookups the value type of a property at given available key path.
 * 
 * If a path doesn't exist, results in `undefined`. 
 * If a non-record property type is encountered along the path, results in `never`. 
 */
export type KeyPathValueAtAvailablePath<T extends Record<string, unknown>, Path extends KeyPath<T>> =
    KeyPathValueAtAnyPath<T, Path>;