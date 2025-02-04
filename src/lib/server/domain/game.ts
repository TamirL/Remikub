import type { User } from "$lib/domain/user";
import type { RealCardData } from "$lib/domain/card";
import type { Board } from "$lib/domain/board";
import { createDeck } from "$lib/server/domain/deck";
import { createEmptyBoard } from "./board";

export type Game = {
    id: string;
    players: PlayerInGame[];
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

    return {
        id: crypto.randomUUID(),
        players: [
            {
                user: players[0],
                userCards: userCards
            }
            // TODO: Add support for multiple players
        ],
        board: createEmptyBoard(),
        deck: deck
    };
}
