import { toShuffledArray } from "$lib/utils/arrayUtils";
import { allCards, type RealCardData } from "../../domain/cards";

export function createShuffledDeck(): RealCardData[] {
    return toShuffledArray(allCards);
}

export function drawCard(deck: RealCardData[]): RealCardData {
    return deck.shift()!;
}
