type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

export function unsafeEntries<T extends object>(obj: T): Entries<T> {
    return Object.entries(obj) as any; // eslint-disable-line
}

export const unsafeKeys = <T extends object>(obj: T) =>
    Object.keys(obj) as Array<keyof T>;

export function getOrdinalNumber(i: number | string) {
    if (typeof i == "string") return i;

    const iN = i;
    i = i.toString();

    const j = iN % 10,
        k = iN % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}
