import type { CardLocation, CardSlotLocation } from "./game";


export type CardMoveAction = {
    from: CardLocation;
    to: CardSlotLocation;
};

export type ReorderUserCardsAction = {
    cardIdsNewOrder: number[];
};
