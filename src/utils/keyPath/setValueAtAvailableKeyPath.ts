import { StringOr } from '$src/types';
import { isRecord } from '$utils/isRecord';
import { setValueAtAnyKeyPath } from '$utils/keyPath/setValueAtAnyKeyPath';
import { KeyPath } from '$utils/keyPath/types/KeyPath';
import { KeyPathValueAtAvailablePath } from '$utils/keyPath/types/KeyPathValueAtAvailablePath';
import Logger from '@aliser/logger';
const { logError } = new Logger();

/**
 * Successful return value.
 */
export type SuccessfulReturn<
    TRecord extends Record<string, unknown>
> = {
    /**
     * Was the setter successful.
     */
    success: true,

    /**
     * The record with the requested property value set.
     */
    record: TRecord
}

/**
 * Failure return value.
 */
export type FailureReturn = {
    /**
     * Was the setter successful.
     */
    success: false,

    /**
     * The traversed part of the path.
     * 
     * Doesn't include the current property.
     */
    traversedPath: string,

    /**
     * A reason for failure:
     * - `missing-property-encountered` — record property at the key path doesn't exist.
     * 
     * - `non-record-property-encountered` — while traversing the path, a property was encountered 
     * which is not a record, stopping the further traversal.
     * Note that this error is only possible if traversal isn't finished (meaning its not on the last path part).
     */
    reason:
    'missing-property-encountered'
    | 'non-record-property-encountered'
}

/**
 * Sets the `record` property at available key path `path` to `value`.
 * Type of the `value` can only be of the property type at the given key path. 
 * 
 * @param record A record.
 * @param path A key path.
 * @param value A value to set.
 * @returns A result object.
 */
export function setValueAtAvailableKeyPath<
    TRecord extends Record<string, unknown>,
    TPath extends KeyPath<TRecord>,
    TValue extends KeyPathValueAtAvailablePath<TRecord, TPath>
>(
    record: TRecord,
    path: TPath,
    value: TValue,
    {
        createMissingProperties = true,
    }: Partial<{
        /**
         * Whether or not to create the missing properties along the path.
         * 
         * Doesn't include the last property on the path — if missing, it'll be created anyway.
         * 
         * @default
         * true  
         */
        createMissingProperties: boolean,
    }> = {}
): SuccessfulReturn<TRecord> | FailureReturn {
    const result = setValueAtAnyKeyPath(record, path, value, { createMissingProperties });
    if (!result.success && result.reason === 'non-record-property-encountered') {
        logError('non-record property encountered — did not expect such property while traversing an available key path', {
            path,
            value,
            record,
            createMissingPropertiesOption: createMissingProperties,
            traversedPath: result.traversedPath
        }, {
            throwErr: true
        });
        throw ''
    }

    return result as any;
}

