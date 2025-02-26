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

export function groupByToMap<T, K>(array: T[], key: (item: T) => K, withoutNull = true): Map<K, T[]> {
    return array.reduce((result, item) => {
        const groupKey = key(item);

        if (withoutNull && groupBy === null) {
            return result;
        }

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

export function splitArrayByNulls<T>(arr: readonly (T | null)[]): T[][] {
    const result: T[][] = [];
    let current: T[] = [];
    for (const item of arr) {
        if (item === null) {
            if (current.length > 0) {
                result.push(current);
                current = [];
            }
        } else {
            current.push(item);
        }
    }
    // Push any remaining elements in the current block.
    if (current.length > 0) {
        result.push(current);
    }
    return result;
}

export function joinArrayWithNull<T>(blocks: T[][]): (T | null)[] {
    const result: (T | null)[] = [];
    blocks.forEach((block, index) => {
        result.push(...block);
        // Add null separator if this isn't the last block.
        if (index !== blocks.length - 1) {
            result.push(null);
        }
    });
    return result;
}