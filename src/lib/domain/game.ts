import { getContext, setContext } from "svelte";
import GameManager from "./managers/gameManager.svelte";
import type BoardManager from "./managers/boardManager.svelte";
import type UserCardsManager from "./managers/userCardsManager.svelte";
import type DeckManager from "./managers/deckManager.svelte";
import type { User } from "./user";
import type { Board } from "./board";
import type { RealCardData } from "./card";

export type GameFromPlayerPerspective = {
    id: string;
    players: User[];
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