import { getContext, setContext } from "svelte";
import GameManager from "./managers/gameManager.svelte";
import type BoardManager from "./managers/boardManager.svelte";
import type UserCardsManager from "./managers/userCardsManager.svelte";
import type DeckManager from "./managers/deckManager.svelte";

export type GameContext = {
    gameManager: GameManager;
    boardManager: BoardManager;
    userCardsManager: UserCardsManager;
    deckManager: DeckManager;
}

export function setGameContext(gameContext: GameContext) {
    setContext('game-context', gameContext);
}

export function getGameContext() {
    return getContext('game-context') as GameContext;
}