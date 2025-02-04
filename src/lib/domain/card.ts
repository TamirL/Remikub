import { getContext, setContext } from "svelte";
import type { CardSlotData } from "./board";
import { compare, type Comparator } from "$lib/utils/comparatorUtils";

export type CardType = 'number' | 'joker';
export type NumberCardColor = 'red' | 'blue' | 'yellow' | 'black';
export type JokerCardColor = 'red' | 'black';

const cardColorsOrder: (NumberCardColor | JokerCardColor)[] = ['yellow', 'blue', 'red', 'black'];
export const cardColorComparator: Comparator<NumberCardColor | JokerCardColor> = compare.unionType(cardColorsOrder);

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

export type RealCardData = RealNumberCardData | RealJokerCardData
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
        case 'red':
            return 'red';
        case 'blue':
            return 'blue';
        case 'yellow':
            return 'yellow';
        case 'black':
            return 'black';
    }
}

function getJokerCardColorForCss(color: JokerCardColor) {
    switch (color) {
        case 'red':
            return 'red';
        case 'black':
            return 'black';
    }
}

type CardSize = {
    width: string;
    height: string;
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
