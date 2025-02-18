import type { CardLocation, CardSlotLocation } from "./game";
import type { UserCardId } from "./userCards";


export type CardMoveAction = {
    from: CardLocation;
    to: CardSlotLocation;
};

export type ReorderUserCardsAction = {
    cardIdsNewOrder: UserCardId[];
};
