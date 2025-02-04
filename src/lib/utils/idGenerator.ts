export function createIdGenerator(): () => number {
    let nextId = 1;
    return () => nextId++;
}