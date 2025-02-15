import { getContext, setContext } from "svelte";
import GameManager from "./managers/gameManager.svelte";
import type { User } from "./user";
import type { Board } from "./board";

export type GameFromPlayerPerspective = {
    id: string;
    players: User[];
    currentTurnUserId: string;
    isItMyTurn: boolean;
    board: Board;
    deckSize: number;
    userCardsIds: number[];
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

