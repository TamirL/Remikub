import crypto from 'crypto';

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

export function toShuffledArray<T>(array: readonly T[]): T[] {
    const resultArray = array.slice();
    shuffledArray(resultArray)
    return resultArray;
}

function shuffledArray<T>(array: T[]): void {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        // Generate a random index from 0 (inclusive) to currentIndex (exclusive)
        const randomIndex = crypto.randomInt(0, currentIndex);
        currentIndex--;
        // Swap the element at currentIndex with the element at randomIndex
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}