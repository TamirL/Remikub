import { createIdGenerator } from "../utils/idGenerator";
import type { CardData, NumberCardColor, NumberCardData, RealCardData } from "./card";

export type CardSlotData = {
    expectedCard: NumberCardData;
    card: RealCardData | null;
}

export type CardNumberGroup = { id: number; numericValue: number; slots: CardSlotData[] };
export type CardRun = { id: number; color: NumberCardColor; slots: CardSlotData[] };

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

export type Board = {
    numberGroups: CardNumberGroup[];
    runs: CardRun[];
}

export type VisibilityOf<T> = T & { isVisible: boolean };

export type BoardWithVisibility = {
    numberGroups: VisibilityOf<CardNumberGroup>[];
    runs: VisibilityOf<CardRun>[];
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