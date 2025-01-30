import type { CardData, NumberCardColor, NumberCardData, RealCardData } from "./card";



export type CardSlotData = {
    expectedCard: NumberCardData;
    card: RealCardData | null;
}

type CardSet = { numericValue: number; slots: CardSlotData[] };
type CardRun = { color: NumberCardColor; slots: CardSlotData[] };

function createEmptySetSlots(numericValue: number): CardSet {
    return {
        numericValue,
        slots: [
            { expectedCard: { type: 'number', color: 'yellow', numericValue }, card: null },
            { expectedCard: { type: 'number', color: 'blue', numericValue }, card: null },
            { expectedCard: { type: 'number', color: 'red', numericValue }, card: null },
            { expectedCard: { type: 'number', color: 'black', numericValue }, card: null }
        ]
    };
}

function createRunEmptySlots(color: NumberCardColor): CardRun {
    return {
        color: color,
        slots: Array.from({ length: 13 }, (_, i) => ({
            expectedCard: { type: 'number', color, numericValue: i + 1 },
            card: null
        }))
    };
}

export type Board = {
    sets: CardSet[];
    allRuns: CardRun[];
}

export function createEmptyBoard(): Board {
    return {
        sets: Array.from({ length: 13 }, (_, i) => ([createEmptySetSlots(i + 1), createEmptySetSlots(i + 1)])).flat(),
        allRuns: [
            createRunEmptySlots('yellow'),
            createRunEmptySlots('yellow'),
            createRunEmptySlots('blue'),
            createRunEmptySlots('blue'),
            createRunEmptySlots('red'),
            createRunEmptySlots('red'),
            createRunEmptySlots('black'),
            createRunEmptySlots('black')
        ]
    };
}

