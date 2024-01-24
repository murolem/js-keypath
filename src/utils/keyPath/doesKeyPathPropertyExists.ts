import { StringOr } from '$src/types';
import { KeyPath } from '$utils/keyPath/types/KeyPath';

/**
 * Checks if a property exists at the given key path.
 * 
 * Note: `undefined` values don't count as non-existent.
 * 
 * @param record a record.
 * @param path a key path.
 * @returns whether or not the given path exists.
 */
export function doesKeyPathPropertyExists<
    T extends Record<string, unknown>,
    Path extends StringOr<KeyPath<T>>
>(
    record: T,
    path: Path
): boolean {
    const partsSplit = path.split('.');
    const partsLength = partsSplit.length;

    let currentRecord: object = record;
    for (const [i, key] of partsSplit.entries()) {
        if (key in currentRecord) {
            const value = (currentRecord as any)[key];
            if (value instanceof Object) {
                currentRecord = value;
                continue;
            } else {
                // - returns `true`, if current part is the last one. 
                // that means that the end of the key path has been reached, 
                // therefore the check was finished successfully.
                //
                // - returns `false` otherwise, when current part is not the last one, 
                // meaning further traversal is not available, therefore the key path does not exist.

                return i + 1 === partsLength;
            }
        } else {
            return false;
        }
    }

    return true;
}