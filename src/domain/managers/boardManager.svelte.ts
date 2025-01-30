import type { Board, CardSlotData } from "../board";
import type { RealCardData } from "../card";
import type DeckManager from "./deckManager.svelte";
import type UserCardsManager from "./userCardsManager.svelte";

class BoardManager {
    private _board: Board = $state({ allRuns: [], sets: [] });

    constructor(board: Board) {
        this._board = board;
    }

    get board(): Board {
        return this._board;
    }

}

export default BoardManager;