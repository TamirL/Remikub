export type IdGenerator = () => number;

export function createIdGenerator(): IdGenerator {
    let nextId = 1;
    return () => nextId++;
}