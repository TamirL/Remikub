import type { Board, CardNumberGroup, CardRun } from "$lib/domain/board";
import type { NumberCardColor } from "$lib/domain/card";
import { createIdGenerator } from "$lib/utils/idGenerator";

const setIdGenerator = createIdGenerator();

function createEmptyNumberGroupSlots(id: number, numericValue: number): CardNumberGroup {
    return {
        id,
        numericValue,
        slots: [
            { expectedCard: { type: 'number', color: 'yellow', numericValue }, card: null },
            { expectedCard: { type: 'number', color: 'blue', numericValue }, card: null },
            { expectedCard: { type: 'number', color: 'red', numericValue }, card: null },
            { expectedCard: { type: 'number', color: 'black', numericValue }, card: null }
        ]
    };
}

function createRunEmptySlots(id: number, color: NumberCardColor): CardRun {
    return {
        id,
        color: color,
        slots: Array.from({ length: 13 }, (_, i) => ({
            expectedCard: { type: 'number', color, numericValue: i + 1 },
            card: null
        }))
    };
}

export function createEmptyBoard(): Board {
    return {
        numberGroups: Array.from({ length: 13 }, (_, i) => ([createEmptyNumberGroupSlots(setIdGenerator(), i + 1), createEmptyNumberGroupSlots(setIdGenerator(), i + 1)])).flat(),
        runs: [
            createRunEmptySlots(setIdGenerator(), 'yellow'),
            createRunEmptySlots(setIdGenerator(), 'yellow'),
            createRunEmptySlots(setIdGenerator(), 'blue'),
            createRunEmptySlots(setIdGenerator(), 'blue'),
            createRunEmptySlots(setIdGenerator(), 'red'),
            createRunEmptySlots(setIdGenerator(), 'red'),
            createRunEmptySlots(setIdGenerator(), 'black'),
            createRunEmptySlots(setIdGenerator(), 'black')
        ]
    };
}