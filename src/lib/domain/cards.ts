import { getContext, setContext } from "svelte";
import type { CardSlotData } from "./board";
import { compare, type Comparator } from "$lib/utils/comparatorUtils";
import { createIdGenerator } from "$lib/utils/idGenerator";
import type { SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";
import { CustomContext } from "$lib/context.svelte";

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

export function isRealNumberCardData(card: CardData): card is RealNumberCardData {
    if (card.type === 'joker') {
        return false;
    }

    return 'id' in card;
}

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

export const cardSizeContext = new CustomContext<CardSize>('CardSize');

export type DraggedCardData = {
    // We should set it with the id of the card, but the drag drop infra can set it to anything
    id: unknown;
    draggedCard: RealCardData;
    draggedFromSlot: CardSlotData;
    draggedFromUserCardIndex?: undefined;
    [SHADOW_ITEM_MARKER_PROPERTY_NAME]?: boolean;
} | {
    // We should set it with the id of the card, but the drag drop infra can set it to anything
    id: unknown;
    draggedCard: RealCardData;
    draggedFromSlot?: undefined;
    draggedFromUserCardIndex: number;
    [SHADOW_ITEM_MARKER_PROPERTY_NAME]?: boolean;
}

export const cardDragDropContext = new CustomContext<null | DraggedCardData>('CardDragDrop');

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
