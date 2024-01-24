import { StringOr } from '$src/types';
import { isRecord } from '$utils/isRecord';
import { KeyPath } from '$utils/keyPath/types/KeyPath';

/**
 * Successful return value.
 */
export type SuccessfulReturn = {
    /**
     * Was the setter successful.
     */
    success: true,

    /**
     * The record with the requested property value set.
     */
    record: Record<string, unknown>
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
     * - `missing-property-encountered` — a missing property was encountered along the path.
     * Can be fixed by configuring one of the options.
     * 
     * - `non-record-property-encountered` — a non-record property was encountered alongh the path.
     * Can be fixed by configuring one of the options.
     * 
     * - `empty-path-provided` — provided path was empty.
     */
    reason:
    'missing-property-encountered'
    | 'non-record-property-encountered'
    | 'empty-path-provided'
}

/**
 * Sets the `record` property at any key path `path` to any `value`. 
 * 
 * @param record A record.
 * @param path A key path.
 * @param value A value to set.
 * @returns A result object.
 */
export function setValueAtAnyKeyPath<
    TRecord extends Record<string, unknown>,
    TPath extends KeyPath<TRecord>,
>(
    record: Record<string, unknown>,
    path: StringOr<TPath>,
    value: unknown,
    {
        createMissingProperties = true,
        replaceExistingProperties = false
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

        /**
         * Whether or not to replace the existing properties alongh the path that are not records.
         * 
         * Doesn't include the last property on the path — it'll be replaced anyway.
         * 
         * @default
         * false 
         */
        replaceExistingProperties: boolean
    }> = {}
): SuccessfulReturn | FailureReturn {
    if (path === '') {
        return {
            success: false,
            reason: 'empty-path-provided',
            traversedPath: ''
        }
    }

    const traversedPath: string[] = [];
    const pathSplit = path.split('.');

    //

    let parentPropValue: unknown = record;
    // set in case the path leads to first level property
    // in that case no checks would be made and the value would remain not defined 
    // and would result in error when accesed later.
    let currentPropValue: unknown = record;

    // iterate until the last part (not including it).
    // this is because we do not need to perform any checks for the last part,
    // since it'll be replaced with a new value.
    for (let i = 0; i < pathSplit.length - 1; i++) {
        const pathPart = pathSplit[i];

        //

        // parentPropValue will always be a record, 
        // since on the first iteration it's the record provided
        // and on the further iterations it's ensured to be a record
        if (!(pathPart in (parentPropValue as Record<string, unknown>))) {
            // if the parent record prop doesn't contain a property `pathPart`,
            // we cannot traverse further, unless the create missing properties option is set.

            if (createMissingProperties) {
                (parentPropValue as Record<string, unknown>)[pathPart] = currentPropValue;
            } else {
                return {
                    success: false,
                    traversedPath: traversedPath.join('.'),
                    reason: 'missing-property-encountered'
                }
            }
        }

        currentPropValue = (parentPropValue as any)[pathPart];

        //

        if (!isRecord(currentPropValue)) {
            // if the current prop value is not a record, we cannot traverse further,
            // unless the replace existing properties option is set.

            if (replaceExistingProperties) {
                currentPropValue = {};
                (parentPropValue as any)[pathPart] = currentPropValue;
            } else {
                return {
                    success: false,
                    traversedPath: traversedPath.join('.'),
                    reason: 'non-record-property-encountered'
                }
            }
        }

        //

        parentPropValue = currentPropValue;
        traversedPath.push(pathPart);
    }

    // set the last path property value to the target value
    (currentPropValue as any)[pathSplit.at(-1)!] = value;

    return {
        success: true,
        record
    };
}