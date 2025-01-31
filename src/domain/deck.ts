import { createIdGenerator } from "../utils/idGenerator";
import type { CardData, RealCardData, RealJokerCardData, RealNumberCardData } from "./card";

const idGenerator = createIdGenerator();

const allNumberCards: RealNumberCardData[] = [
    // First number group
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].flatMap((numericValue): RealNumberCardData[] => [
        { type: 'number', id: idGenerator(), numericValue, color: 'yellow' },
        { type: 'number', id: idGenerator(), numericValue, color: 'yellow' },
        { type: 'number', id: idGenerator(), numericValue, color: 'blue' },
        { type: 'number', id: idGenerator(), numericValue, color: 'blue' },
        { type: 'number', id: idGenerator(), numericValue, color: 'red' },
        { type: 'number', id: idGenerator(), numericValue, color: 'red' },
        { type: 'number', id: idGenerator(), numericValue, color: 'black' },
        { type: 'number', id: idGenerator(), numericValue, color: 'black' },
    ]),
];

const allJokerCards: RealJokerCardData[] = [
    { type: 'joker', id: idGenerator(), color: 'red' },
    { type: 'joker', id: idGenerator(), color: 'black' }
];

export const allCards: RealCardData[] = [
    ...allNumberCards,
    ...allJokerCards
];

export function createDeck(): RealCardData[] {
    return allCards.sort(() => Math.random() - 0.5);
}

export function drawCard(deck: RealCardData[]): RealCardData {
    return deck.shift()!;
}
