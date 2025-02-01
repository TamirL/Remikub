import type { Board, CardSlotData } from "../board";
import type BoardManager from "./boardManager.svelte";
import { canPutRealCardOnSlot, type RealCardData } from "../card";
import type DeckManager from "./deckManager.svelte";
import type UserCardsManager from "./userCardsManager.svelte";

class Game {
    private deckManager: DeckManager;
    private userCardsManager: UserCardsManager;
    private boardManager: BoardManager;

    constructor(deckManager: DeckManager, boardManager: BoardManager, userCardsManager: UserCardsManager) {
        this.deckManager = deckManager;
        this.boardManager = boardManager;
        this.userCardsManager = userCardsManager;
    }

    moveCardFromSlot(from: CardSlotData, to: CardSlotData): void {
        const cardToMove = from.card;
        if (!cardToMove) {
            console.error('No card to move from slot', from);
            return;
        }

        if (to.card) {
            console.error('Slot already has a card', to);
            return;
        }

        if (!canPutRealCardOnSlot(cardToMove, to.expectedCard)) {
            console.error('Cannot put card on slot', to);
            return;
        }

        from.card = null;
        to.card = cardToMove;
    }

    moveCardFromUserCards(card: RealCardData, to: CardSlotData): boolean {
        if (!canPutRealCardOnSlot(card, to.expectedCard)) {
            console.error('Cannot put card on slot', to);
            return false;
        }

        this.userCardsManager.removeCard(card);
        to.card = card;
        return true;
    }

    drawCardFromDeck(): RealCardData {
        const drawnCard = this.deckManager.drawCard();
        this.userCardsManager.addCard(drawnCard);
        return drawnCard;
    }
}

export default Game;