import { getContext, setContext } from "svelte";
import GameManager from "./managers/gameManager.svelte";
import type { User } from "./user";
import type { Board, CardNumberGroup, CardRun } from "./board";

export type RelevantCardsForPlayerTurn = {
    board: Board;
    playerCardIds: number[];
}

export type GameFromPlayerPerspective = {
    id: string;
    players: User[];
    currentTurnUserId: string;
    isItMyTurn: boolean;
    board: Board;
    deckSize: number;
    userCardsIds: number[];
    beforePlayerChangesData: RelevantCardsForPlayerTurn | null;
}

export type GameLobbyFromUserPerspective = {
    id: string;
    players: User[];
    amIParticipating: boolean;
    hasStarted: boolean;
}

export type GameContext = {
    gameManager: GameManager;
}

export function setGameContext(gameContext: GameContext) {
    setContext('game-context', gameContext);
}

export function getGameContext() {
    return getContext('game-context') as GameContext;
}

export type CardLocation = {
    location: 'user' | 'board';
    cardId: number;
}

export type CardSlotLocation = {
    location: 'user' | 'board';
    slotId: number;
}

export function calcIsBoardValid(board: Board): boolean {
    return board.numberGroups.every(numberGroup => isNumberGroupValid(numberGroup)) &&
        board.runs.every(run => isRunValid(run));
}

function isNumberGroupValid(numberGroup: CardNumberGroup): boolean {
    const amountOfCardsInNumberGroup = numberGroup.slots.filter(slot => slot.cardId).length;
    // should be empty or have atleast 3 cards  
    return amountOfCardsInNumberGroup === 0 || amountOfCardsInNumberGroup >= 3;
}

function isRunValid(run: CardRun): boolean {
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