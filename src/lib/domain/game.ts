import { getContext, setContext } from "svelte";
import GameManager from "./managers/gameManager.svelte";
import type { User } from "./user";
import type { Board } from "./board";
import type { RealCardData } from "./cards";

export type GameFromPlayerPerspective = {
    id: string;
    players: User[];
    currentTurnUserId: string;
    board: Board;
    deckSize: number;
    userCards: RealCardData[];
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

export type CardMoveAction = {
    from: CardLocation;
    to: CardSlotLocation;
}