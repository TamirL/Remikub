import type { CardData, JokerCardData, NumberCardData } from "./card";

const allNumberCards: NumberCardData[] = [
    // First set
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].flatMap((numericValue): NumberCardData[] => [
        { type: 'number', numericValue, color: 'yellow' },
        { type: 'number', numericValue, color: 'yellow' },
        { type: 'number', numericValue, color: 'blue' },
        { type: 'number', numericValue, color: 'blue' },
        { type: 'number', numericValue, color: 'red' },
        { type: 'number', numericValue, color: 'red' },
        { type: 'number', numericValue, color: 'black' },
        { type: 'number', numericValue, color: 'black' },
    ]),
];

const allJokerCards: JokerCardData[] = [
    { type: 'joker', color: 'red' },
    { type: 'joker', color: 'black' }
];

export const allCards: CardData[] = [
    ...allNumberCards,
    ...allJokerCards
];

export function createDeck(): CardData[] {
    return allCards.sort(() => Math.random() - 0.5);
}

export function drawCard(deck: CardData[]): CardData {
    return deck.shift()!;
}
    