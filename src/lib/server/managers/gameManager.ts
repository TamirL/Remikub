import type { Board, CardNumberGroup, CardRun, CardSlotData } from "$lib/domain/board";
import { canPutRealCardOnSlot, type RealCardData } from "$lib/domain/cards";
import type { Game } from "$lib/server/domain/game";

class GameManager {
    private _game: Game = $state({} as Game);
    private _isBoardValid: boolean = $derived.by(() => this.calcIsBoardValid(this._game.board));

    constructor(game: Game) {
        this._game = game;
    }

    // Deck Management
    drawCard(userId: string): RealCardData {
        const newCardFromDeck = this._game.deck.shift();
        if (!newCardFromDeck) {
            throw new Error('Deck is empty');
        }
        this.addCardToUserCards(userId, newCardFromDeck);
        return newCardFromDeck;
    }

    // User Cards Management
    private addCardToUserCards(userId: string, card: RealCardData): void {
        // TODO: Add proper user management
        const user = this._game.players.find(p => p.userId === userId);

        if (!user) {
            throw new Error('User not found');
        }

        user.userCardsIds.push(card.id);
    }


    removeCardFromUserCards(userId: string, card: RealCardData): void {
        // TODO: Add proper user management
        const user = this._game.players.find(p => p.userId === userId);

        if (!user) {
            throw new Error('User not found');
        }

        user.userCardsIds = user.userCardsIds.filter(cardId => cardId !== card.id);
    }

    // // Card Movement
    // moveCardFromSlot(from: CardSlotData, to: CardSlotData): void {
    //     const cardToMove = from.card;
    //     if (!cardToMove) {
    //         console.error('No card to move from slot', from);
    //         return;
    //     }

    //     if (to.card) {
    //         console.error('Slot already has a card', to);
    //         return;
    //     }

    //     if (!canPutRealCardOnSlot(cardToMove, to.expectedCard)) {
    //         console.error('Cannot put card on slot', to);
    //         return;
    //     }

    //     from.card = null;
    //     to.card = cardToMove;
    // }

    // moveCardFromUserCards(userId: string, card: RealCardData, to: CardSlotData): boolean {
    //     if (!canPutRealCardOnSlot(card, to.expectedCard)) {
    //         console.error('Cannot put card on slot', to);
    //         return false;
    //     }

    //     this.removeCardFromUserCards(userId, card);
    //     to.card = card;
    //     return true;
    // }

    // Board validation
    get isBoardValid(): boolean {
        return this._isBoardValid;
    }

    private calcIsBoardValid(board: Board): boolean {
        return board.numberGroups.every(numberGroup => this.isNumberGroupValid(numberGroup)) &&
            board.runs.every(run => this.isRunValid(run));
    }

    private isNumberGroupValid(numberGroup: CardNumberGroup): boolean {
        const amountOfCardsInNumberGroup = numberGroup.slots.filter(slot => slot.cardId).length;
        return amountOfCardsInNumberGroup === 0 || amountOfCardsInNumberGroup >= 3;
    }

    private isRunValid(run: CardRun): boolean {
        let currentSetSize = 0;

        for (const slot of run.slots) {
            if (slot.cardId) {
                currentSetSize++;
            } else {
                if (currentSetSize !== 0 && currentSetSize < 3) {
                    return false;
                }
                currentSetSize = 0;
            }
        }

        return currentSetSize === 0 || currentSetSize >= 3;
    }
}


export default GameManager;