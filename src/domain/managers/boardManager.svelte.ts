import type { Board, CardRun, CardSet, CardSlotData } from "../board";
import type { RealCardData } from "../card";
import type DeckManager from "./deckManager.svelte";
import type UserCardsManager from "./userCardsManager.svelte";

class BoardManager {
    private _board: Board = $state({ allRuns: [], sets: [] });
    private _isBoardValid: boolean = $derived.by(() => BoardManager.calcIsBoardValid(this._board));

    constructor(board: Board) {
        this._board = board;
    }

    get board(): Board {
        return this._board;
    }

    get isBoardValid(): boolean {
        return this._isBoardValid;
    }

    private static calcIsBoardValid(board: Board): boolean {
        return board.sets.every(set => this.isSetValid(set)) &&
            board.allRuns.every(run => this.isRunValid(run));
    }

    private static isSetValid(set: CardSet): boolean {
        const amountOfCardsInSet = set.slots.filter(slot => slot.card).length;
        // should be empty or have atleast 3 cards  
        return amountOfCardsInSet === 0 || amountOfCardsInSet >= 3;
    }

    static isRunValid(run: CardRun): boolean {
        let index = 0;
        let currentSeriesSize = 0;

        for (let index = 0; index < run.slots.length; index++) {
            const slot = run.slots[index];
            if (slot.card) {
                currentSeriesSize++;
            } else {
                if (currentSeriesSize !== 0 && currentSeriesSize < 3) {
                    // it means there is a series of cards that is under 3 cards
                    return false;
                }
                currentSeriesSize = 0;
            }
        }

        // if there is a series of cards that is under 3 cards, it means the run is invalid
        return currentSeriesSize < 3;
    }
}

export default BoardManager;