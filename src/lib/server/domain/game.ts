import type { User } from "$lib/domain/user";
import type { RealCardData } from "$lib/domain/card";
import type { Board } from "$lib/domain/board";
import { createDeck } from "$lib/server/domain/deck";
import DeckManager from "$lib/server/managers/deckManager";
import BoardManager from "$lib/server/managers/boardManager";
import UserCardsManager from "$lib/server/managers/userCardsManager";
import { createEmptyBoard } from "./board";

export type Game = {
    id: string;
    players: User[];
    board: Board;
    deck: RealCardData[];
}



export type PlayerInGame = {
    user: User;
    userCards: RealCardData[];
}

export function createGame(players: User[]): Game {
    const deck = createDeck();
    const userCards = deck.splice(0, 14);
    const deckManager = new DeckManager(deck);
    const boardManager = new BoardManager(createEmptyBoard());
    const userCardsManager = new UserCardsManager(userCards);

    const gameManager = {
        gameManager: new GameManager(deckManager, boardManager, userCardsManager),
        boardManager,
        userCardsManager,
        deckManager
	};
}
