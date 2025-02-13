import type { NumberCardColor, NumberCardData, RealCardData } from "./cards";

export type CardSlotData = {
    id: number;
    expectedCard: NumberCardData;
    cardId: number | null;
}

export type CardNumberGroup = { id: number; numericValue: number; slots: CardSlotData[] };
export type CardRun = { id: number; color: NumberCardColor; slots: CardSlotData[] };

export type Board = {
    numberGroups: CardNumberGroup[];
    runs: CardRun[];
}