import type { User } from "$lib/domain/user";
import type { RealCardData } from "$lib/domain/cards";
import type { Board } from "$lib/domain/board";
import { createShuffledDeck } from "$lib/server/domain/deck";
import { createEmptyBoard } from "./board";
import type { GameFromPlayerPerspective, GameLobbyFromUserPerspective, RelevantCardsForPlayerTurn } from "$lib/domain/game";
import { getUser } from "../storage/users";
import type { UserCardId } from "$lib/domain/userCards";

export type Game = {
    hasStarted: boolean;
    id: string;
    initiatingPlayerId: string;
    players: Map<string, PlayerInGame>;
    currentTurnPlayerId: string;
    board: Board;
    beforePlayerChangesData: RelevantCardsForPlayerTurn;
    deck: RealCardData[];
}

export type PlayerInGame = {
    userId: string;
    userCardsIds: UserCardId[];
}

export function createGame(initiatingPlayerId: string): Game {
    const deck = createShuffledDeck();

    const userCardsIds = deck.splice(0, 14).map(c => c.id);
    const player: PlayerInGame = {
        userId: initiatingPlayerId,
        userCardsIds: userCardsIds
    };

    return {
        id: createJoinCode(),
        hasStarted: false,
        initiatingPlayerId,
        players: new Map<string, PlayerInGame>(
            [[initiatingPlayerId, player]]
        ),
        currentTurnPlayerId: initiatingPlayerId,
        board: createEmptyBoard(),
        beforePlayerChangesData: {
            board: createEmptyBoard(),
            playerCardIds: userCardsIds
        },
        deck: deck
    };
}

function createJoinCode(): string {
    // this function should create a random 6 digit code that is not already in use
    return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

export async function getGameFromUserPerspective(game: Game, userId: string): Promise<GameFromPlayerPerspective> {
    const player = game.players.get(userId);

    if (!player) {
        throw new Error('Forbidden');
    }

    const users = await Promise.all(game.players.keys().map(userId => getUser(userId)));

    if (!users.every((user): user is User => !!user)) {
        throw new Error('Forbidden');
    }

    const isItMyTurn = game.currentTurnPlayerId === userId;

    return {
        id: game.id,
        players: users,
        currentTurnUserId: game.currentTurnPlayerId,
        isItMyTurn: isItMyTurn,
        board: game.board,
        deckSize: game.deck.length,
        userCardsIds: player.userCardsIds,
        beforePlayerChangesData: isItMyTurn ? game.beforePlayerChangesData : null
    };
}
export async function getGameLobbyFromUserPerspective(game: Game, userId: string): Promise<GameLobbyFromUserPerspective> {
    const users = await Promise.all(game.players.keys().map(userId => getUser(userId)));

    if (!users.every((user): user is User => !!user)) {
        throw new Error('Forbidden');
    }

    return {
        id: game.id,
        players: users,
        hasStarted: game.hasStarted,
        amIParticipating: users.some(u => u.id === userId),
    };
}