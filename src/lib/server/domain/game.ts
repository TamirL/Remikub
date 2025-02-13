import type { User } from "$lib/domain/user";
import type { RealCardData } from "$lib/domain/cards";
import type { Board } from "$lib/domain/board";
import { createDeck } from "$lib/server/domain/deck";
import { createEmptyBoard } from "./board";
import type { GameFromPlayerPerspective } from "$lib/domain/game";

export type Game = {
    id: string;
    players: PlayerInGame[];
    currentTurnPlayerId: string;
    board: Board;
    deck: RealCardData[];
}

export type PlayerInGame = {
    user: User;
    userCardsIds: number[];
}

export function createGame(players: User[]): Game {
    const deck = createDeck();
    const userCardsIds = deck.splice(0, 14).map(c => c.id);

    return {
        id: crypto.randomUUID(),
        players: [
            {
                user: players[0],
                userCardsIds,
            }
            // TODO: Add support for multiple players
        ],
        currentTurnPlayerId: players[0].id,
        board: createEmptyBoard(),
        deck: deck
    };
}

export function getGameFromUserPerspective(game: Game, userId: string): GameFromPlayerPerspective {
    const player = game.players.find(p => p.user.id === userId);

    if (!player) {
        throw new Error('Forbidden');
    }

    return {
        id: game.id,
        players: game.players.map(p => p.user),
        currentTurnUserId: game.currentTurnPlayerId,
        board: game.board,
        deckSize: game.deck.length,
        userCardsIds: player.userCardsIds
    };
}