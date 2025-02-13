import type { RealCardData } from "$lib/domain/cards";

class DeckManager {
    private _deck: RealCardData[] = $state([]);

    constructor(deck: RealCardData[]) {
        this._deck = deck;
    }

    get deck(): readonly RealCardData[] {
        return this._deck;
    }

    drawCard(): RealCardData {
        const newCardFromDeck = this._deck.shift();

        if (!newCardFromDeck) {
            throw new Error('Deck is empty');
        }

        return newCardFromDeck;
    }
}

export default DeckManager; 