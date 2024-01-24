/**
 * Lookups the value type of a property at given arbitrary key path.
 * 
 * If a path doesn't exist, results in `undefined`. 
 * If a non-record property type is encountered along the path, results in `never`. 
 */
export type KeyPathValueAtAnyPath<T extends Record<string, unknown>, Path extends string> =
    // check if we extend the key path pattern
    Path extends `${infer L}.${infer R}`
    ? (
        // if yes, check if the first part of the path extends the keys of current record
        // note: the use of `Required` is due to the optional prop paths resulting in never otherwise 
        L extends keyof Required<T>
        ? (
            // if yes, check if the value of the target prop is a record
            Required<T>[L] extends Record<string, unknown>
            // if yes, continue the lookup
            ? KeyPathValueAtAnyPath<Required<T>[L], R>
            // if no, we're stuck due to the path not being over yet.
            // the end value cannot be counted is undefined, since one of its parent props is of a non-record type,
            // so the path is not reachable whatsoever, hence the never
            : never
        )
        // if the first part of the path doesn't extend the keys of the current record keys,
        // then we're stuck due to the path not being over yet.
        // if no key extend the path, its doesnt exist, hence the undefined
        : undefined
    )
    // if we dont' extend the pattern, than we either: 
    // - reached the end of it
    // - encountered not a valid pattern
    // there's not way to know, so lets just hope and pray, and try to to retrieve the value (the type)
    : (
        // if there a key
        Path extends keyof T
        // there a way — return the value (type) of that key (value)
        ? T[Path]
        // if no key extend the path, its doesnt exist, hence the undefined
        : undefined
    )