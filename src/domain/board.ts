import type { CardData, NumberCardColor, NumberCardData, RealCardData } from "./card";



export type CardSlotData = {
    expectedCard: NumberCardData;
    card: RealCardData | null;
}

type CardSet = { numericValue: number; slots: CardSlotData[] };
type CardRun = { color: NumberCardColor; slots: CardSlotData[] };

type Board = {
    sets: CardSet[];
    allRuns: CardRun[];
}


function createEmptyBoardSet(numericValue: number): CardSet {
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

function createRun(color: NumberCardColor): CardRun {
    return {
        color: color,
        slots: Array.from({ length: 13 }, (_, i) => ({
            expectedCard: { type: 'number', color, numericValue: i + 1 },
            card: null
        }))
    };
}

export const emptyBoard: Board = {
    sets: Array.from({ length: 13 }, (_, i) => ([createEmptyBoardSet(i + 1), createEmptyBoardSet(i + 1)])).flat(),
    allRuns: [
        createRun('yellow'),
        createRun('yellow'),
        createRun('blue'),
        createRun('blue'),
        createRun('red'),
        createRun('red'),
        createRun('black'),
        createRun('black')
    ]
}

