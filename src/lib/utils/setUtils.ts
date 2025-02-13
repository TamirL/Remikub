export function isSetsEqual<T>(a: Set<T>, b: Set<T>): boolean {
    return a.size === b.size && new Set([...a, ...b]).size === a.size
}