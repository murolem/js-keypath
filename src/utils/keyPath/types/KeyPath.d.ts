/**
 * Given a record `T`, traverses its heirarchy and generates a set of 
 * «paths», eachs corresponding to an individual property, including the properties that are records themselfs.
 * 
 * Does not guarantee that each path does exist, since the optional paths also included in the calculation.
 * 
 * Path parts are separated with `.`. 
 */
export type KeyPath<T extends Record<string, unknown>> = {
    // obvious check to help typescript
    // get only the string keys
    [K in keyof Required<T>]: K extends string
    // rest of the owl
    // the use of `Required` is due to the optional prop paths being missing otherwise 
    ? (
        // if prop is a record
        Required<T>[K] extends Record<string, unknown>
        // get the prop key OR the joined keys of the record key paths
        ? K | `${K}.${KeyPath<Required<T>[K]>}`
        // otherwise, only get the prop key
        : K
    )
    : never
}[keyof T]; // get the generated keys