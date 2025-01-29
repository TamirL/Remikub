import { getContext, setContext } from "svelte";

export type CardType = 'number' | 'joker';
export type NumberCardColor = 'red' | 'blue' | 'yellow' | 'black';
export type JokerCardColor = 'red' | 'black';

export type NumberCardData = {
    type: 'number';
    color: NumberCardColor;
    numericValue: number;
};

export type JokerCardData = {
    type: 'joker';
    color: JokerCardColor;
};

export type CardData = NumberCardData | JokerCardData;

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

export function setCardDragDropContext(card: CardData | null) {
    setContext('CardDragDrop', card);
}

export function getCardDragDropContext() {
    return (getContext('CardDragDrop') ?? null) as CardData | null;
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
