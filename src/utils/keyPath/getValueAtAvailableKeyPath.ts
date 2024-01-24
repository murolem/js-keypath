import { isRecord } from '$utils/isRecord';
import { KeyPath } from '$utils/keyPath/types/KeyPath';
import { KeyPathValueAtAnyPath } from '$utils/keyPath/types/KeyPathValueAtAnyPath';
import Logger from '@aliser/logger';
const { logError } = new Logger();

/**
 * Successful return value.
 */
export type SuccessfulReturn<
    TRecord extends Record<string, unknown>,
    Path extends KeyPath<TRecord>
> = {
    /**
     * Was the extraction successful.
     */
    success: true,

    /**
     * The extracted value at path.
     */
    value: KeyPathValueAtAnyPath<TRecord, Path>
}

/**
 * Failure return value.
 */
export type FailureReturn = {
    /**
     * Was the extraction successful.
     */
    success: false,

    /**
     * Currently traversed path.
     */
    traversedPath: string,

    /**
     * A reason for failure:
     * - `missing-property-encountered` — record property at the key path doesn't exist.
     */
    reason:
    'missing-property-encountered'
}

/**
 * Extracts the property at key path `path` from the `record`. 
 * 
 * Since `path` is derived from the record, it represents all possible paths, including optional ones. 
 * Because of this, the returned value is not a property value, 
 * but a "result" object with metadata about the extracted property value (if any).
 * 
 * @param record A record.
 * @param path A key path.
 * @returns A result object.
 */
export function getValueAtAvailableKeyPath<
    TRecord extends Record<string, any>,
    Path extends KeyPath<TRecord>
>(
    record: TRecord,
    path: Path
): SuccessfulReturn<TRecord, Path> | FailureReturn {
    const traversedPath: string[] = [];
    const pathSplit = path.split('.');

    let currentPropValue: unknown = record;
    for (const [i, pathPart] of pathSplit.entries()) {
        if (!isRecord(currentPropValue)) {
            logError(`Non-record property "${pathPart}" encountered while executing the keypath getter.`, {
                traversedPath,
                record
            }, { throwErr: true });
            throw '' // type guard

        } else if (!(pathPart in currentPropValue)) {
            return {
                success: false,
                traversedPath: traversedPath.join('.'),
                reason: 'missing-property-encountered'
            }
        }

        currentPropValue = currentPropValue[pathPart];
        traversedPath.push(pathPart);
    }

    return {
        success: true,
        value: currentPropValue as KeyPathValueAtAnyPath<TRecord, Path>
    };
}