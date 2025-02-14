export function groupBy<T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> {
    return array.reduce((result, item) => {
        const groupKey = key(item);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<K, T[]>);
}

export function groupByToMap<T, K>(array: T[], key: (item: T) => K): Map<K, T[]> {
    return array.reduce((result, item) => {
        const groupKey = key(item);
        if (!result.has(groupKey)) {
            result.set(groupKey, []);
        }
        result.get(groupKey)!.push(item);
        return result;
    }, new Map<K, T[]>());
}

export function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}