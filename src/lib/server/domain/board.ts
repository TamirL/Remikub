import type { Board, CardNumberGroup, CardRun } from "$lib/domain/board";
import type { NumberCardColor } from "$lib/domain/cards";
import { createIdGenerator, type IdGenerator } from "$lib/utils/idGenerator";

const setIdGenerator = createIdGenerator();
const slotIdGenerator = createIdGenerator();

function createEmptyNumberGroupSlots(id: number, numericValue: number, slotIdGenerator: IdGenerator): CardNumberGroup {
    return {
        id,
        numericValue,
        slots: [
            { id: slotIdGenerator(), expectedCard: { type: 'number', color: 'yellow', numericValue }, cardId: null },
            { id: slotIdGenerator(), expectedCard: { type: 'number', color: 'blue', numericValue }, cardId: null },
            { id: slotIdGenerator(), expectedCard: { type: 'number', color: 'red', numericValue }, cardId: null },
            { id: slotIdGenerator(), expectedCard: { type: 'number', color: 'black', numericValue }, cardId: null }
        ]
    };
}

function createRunEmptySlots(id: number, color: NumberCardColor, slotIdGenerator: IdGenerator): CardRun {
    return {
        id,
        color: color,
        slots: Array.from({ length: 13 }, (_, i) => ({
            id: slotIdGenerator(),
            expectedCard: { type: 'number', color, numericValue: i + 1 },
            cardId: null
        }))
    };
}

export function createEmptyBoard(): Board {
    return {
        numberGroups: Array.from({ length: 13 }, (_, i) => ([createEmptyNumberGroupSlots(setIdGenerator(), i + 1, slotIdGenerator), createEmptyNumberGroupSlots(setIdGenerator(), i + 1, slotIdGenerator)])).flat(),
        runs: [
            createRunEmptySlots(setIdGenerator(), 'yellow', slotIdGenerator),
            createRunEmptySlots(setIdGenerator(), 'yellow', slotIdGenerator),
            createRunEmptySlots(setIdGenerator(), 'blue', slotIdGenerator),
            createRunEmptySlots(setIdGenerator(), 'blue', slotIdGenerator),
            createRunEmptySlots(setIdGenerator(), 'red', slotIdGenerator),
            createRunEmptySlots(setIdGenerator(), 'red', slotIdGenerator),
            createRunEmptySlots(setIdGenerator(), 'black', slotIdGenerator),
            createRunEmptySlots(setIdGenerator(), 'black', slotIdGenerator)
        ]
    };
}