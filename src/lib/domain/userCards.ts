import { type Comparator } from "$lib/utils/comparatorUtils";
import type { RealCardData } from "./cards";

export type UserCardId = number | null;
export type UserCard = RealCardData | null;

export type UserCardsOrdered = {
    sets: RealCardData[][],
    otherCards: RealCardData[],
}

export function orderUserCardsBySameComparator(userCards: UserCardsOrdered, comparator: Comparator<RealCardData>): UserCardsOrdered {
    return {
        sets: userCards.sets.map(set => set.toSorted(comparator)),
        otherCards: userCards.otherCards.toSorted(comparator),
    }
}