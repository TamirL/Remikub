import { allCards, type RealCardData } from "../../domain/cards";

export function createDeck(): RealCardData[] {
    return allCards.sort(() => Math.random() - 0.5);
}

export function drawCard(deck: RealCardData[]): RealCardData {
    return deck.shift()!;
}
