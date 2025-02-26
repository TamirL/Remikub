
export function isSetsEqual<T>(a: Set<T>, b: Set<T>): boolean {
    return a.size === b.size && new Set([...a, ...b]).size === a.size
}

export function getAnyValue<T>(set: Set<T>): T | null {
    return set.values().next().value ?? null;
}