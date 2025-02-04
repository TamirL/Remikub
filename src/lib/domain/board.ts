import type { NumberCardColor, NumberCardData, RealCardData } from "./card";

export type CardSlotData = {
    expectedCard: NumberCardData;
    card: RealCardData | null;
}

export type CardNumberGroup = { id: number; numericValue: number; slots: CardSlotData[] };
export type CardRun = { id: number; color: NumberCardColor; slots: CardSlotData[] };


export type Board = {
    numberGroups: CardNumberGroup[];
    runs: CardRun[];
}