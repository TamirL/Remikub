import { compare } from "$lib/utils/comparatorUtils";
import { groupByToMap } from "$lib/utils/arrayUtils";
import type { Board, CardNumberGroup, CardRun } from "$lib/domain/board";
import type { NumberCardColor, RealCardData } from "$lib/domain/cards";

class BoardManager {
    private _board: Board = $state({ runs: [], numberGroups: [] });
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
        return board.numberGroups.every(numberGroup => this.isNumberGroupValid(numberGroup)) &&
            board.runs.every(run => this.isRunValid(run));
    }

    private static isNumberGroupValid(numberGroup: CardNumberGroup): boolean {
        const amountOfCardsInNumberGroup = numberGroup.slots.filter(slot => slot.cardId).length;
        // should be empty or have atleast 3 cards  
        return amountOfCardsInNumberGroup === 0 || amountOfCardsInNumberGroup >= 3;
    }

    static isRunValid(run: CardRun): boolean {
        let currentSetSize = 0;

        for (let index = 0; index < run.slots.length; index++) {
            const slot = run.slots[index];
            if (slot.cardId) {
                currentSetSize++;
            } else {
                if (currentSetSize !== 0 && currentSetSize < 3) {
                    // it means there is a set of cards that is under 3 cards
                    return false;
                }
                currentSetSize = 0;
            }
        }

        // if there is a set of cards that is under 3 cards, it means the run is invalid
        return currentSetSize === 0 || currentSetSize >= 3;
    }
}

export default BoardManager;