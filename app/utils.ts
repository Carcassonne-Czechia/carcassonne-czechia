type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

export function unsafeEntries<T extends object>(obj: T): Entries<T> {
    return Object.entries(obj) as any; // eslint-disable-line
}

export const unsafeKeys = <T extends object>(obj: T) =>
    Object.keys(obj) as Array<keyof T>;
