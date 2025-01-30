import type { CardSlotData } from "../board";
import type { RealCardData } from "../card";

class DeckManager {
    private deck: RealCardData[] = $state([]);

    constructor(deck: RealCardData[]) {
        this.deck = deck;
    }

    drawCard(): RealCardData {
        const newCardFromDeck = this.deck.shift();

        if (!newCardFromDeck) {
            throw new Error('Deck is empty');
        }

        return newCardFromDeck;
    }
}

export default DeckManager; 