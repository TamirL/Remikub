import { getContext, setContext } from "svelte";
import type { CardSlotData } from "./board";
import { compare, type Comparator } from "$lib/utils/comparatorUtils";
import { createIdGenerator } from "$lib/utils/idGenerator";

export type CardType = 'number' | 'joker';
export type NumberCardColor = 'red' | 'blue' | 'yellow' | 'black';
export type JokerCardColor = 'red' | 'black';

type BaseCardData = {
    type: CardType;
}

export type NumberCardData = BaseCardData & {
    type: 'number';
    color: NumberCardColor;
    numericValue: number;
};

type BaseRealCardData = {
    id: number;
}

export type RealNumberCardData = NumberCardData & BaseRealCardData & {
};

export type RealJokerCardData = BaseCardData & BaseRealCardData & {
    type: 'joker';
    color: JokerCardColor;
};

export type RealCardData = RealNumberCardData | RealJokerCardData;
export type CardData = NumberCardData | RealCardData;

export function getCssCardColor(cardData: CardData) {
    switch (cardData.type) {
        case 'number':
            return getNumberCardColorForCss(cardData.color);

        case 'joker':
            return getJokerCardColorForCss(cardData.color);
    }
}

function getNumberCardColorForCss(color: NumberCardColor) {
    switch (color) {
        case 'yellow':
            return 'var(--yellow-card-color)';
        case 'blue':
            return 'var(--blue-card-color)';
        case 'red':
            return 'var(--red-card-color)';
        case 'black':
            return 'var(--black-card-color)';
    }
}

function getJokerCardColorForCss(color: JokerCardColor) {
    switch (color) {
        case 'red':
            return 'var(--red-card-color)';
        case 'black':
            return 'var(--black-card-color)';
    }
}

type CardSize = {
    width: string;
    height: string;
    widthPx: number;
    heightPx: number;
}

export function setCardSizeContext(size: CardSize) {
    setContext('CardSize', size);
}

export function getCardSizeContext() {
    return getContext('CardSize') as CardSize;
}

type CardDragDropContextData = {
    draggedCard: RealCardData | null;
    draggedFrom: CardSlotData | null;
}

export function setCardDragDropContext(dragDropInitialContext: CardDragDropContextData) {
    setContext('CardDragDrop', dragDropInitialContext);
}

export function getCardDragDropContext(): CardDragDropContextData {
    return getContext('CardDragDrop') as CardDragDropContextData;
}

export function canPutRealCardOnSlot(realCard: RealCardData, cardSlot: NumberCardData) {
    switch (realCard.type) {
        case 'number':
            return realCard.color === cardSlot.color && realCard.numericValue === cardSlot.numericValue;
        case 'joker':
            return true;
    }
}

export function isCardsEqual(card1: CardData | null, card2: CardData | null) {
    if (card1 === null && card2 === null) {
        return true;
    }

    if (card1 === null || card2 === null) {
        return false;
    }

    if (card1.type !== card2.type) {
        return false;
    }

    switch (card1.type) {
        case 'number':
            return card1.color === card2.color && card1.numericValue === (card2 as NumberCardData).numericValue;
        case 'joker':
            return card1.color === card2.color;
    }
}

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

export const allCardsById = new Map(allCards.map(card => [card.id, card]));

export const cardByTypeComperator = compare.byField<RealCardData, CardType>(card => card.type, compare.unionType(['number', 'joker']))
const cardColorComperator: Comparator<NumberCardColor | JokerCardColor> = compare.unionType(['yellow', 'blue', 'red', 'black']);
export const cardByColorComparator: Comparator<RealCardData> = compare.byField(card => card.color, cardColorComperator);

export const cardByValueComparator: Comparator<RealCardData> = compare.fromCompareFunction((card1: RealCardData, card2: RealCardData): number => {
    if (card1.type === 'number' && card2.type === 'number') {
        return card1.numericValue - card2.numericValue;
    }

    if (card1.type === 'joker' && card2.type === 'joker') {
        if (card1.color === 'red') {
            return -1;
        }

        return 1;
    }

    if (card1.type === 'joker') {
        return -1;
    }

    return 1;
});
