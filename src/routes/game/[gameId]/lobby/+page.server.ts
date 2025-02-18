import { getGame, storeGame } from "$lib/server/storage/game";
import { getGameLobbyFromUserPerspective, type Game, type PlayerInGame } from "$lib/server/domain/game";
import { error, redirect } from "@sveltejs/kit";
import type { GameLobbyFromUserPerspective } from "$lib/domain/game";
import { getUser } from "$lib/server/storage/users.js";
import { broadcastGameLobbyUpdate } from "../../../api/game/[gameId]/lobby/updates/lobbyUpdatePusher.js";
import { getRandomElement } from "$lib/utils/arrayUtils.js";
import { isDefined } from "$lib/utils/utils.js";

export async function load({ params, cookies }): Promise<GameLobbyFromUserPerspective> {
    const userId = cookies.get('userId');
    if (!userId) {
        throw error(401, 'Unauthorized');
    }
    const { gameId } = params;
    if (typeof gameId !== 'string' && !gameId) {
        throw error(400, 'Bad request');
    }
    const game = await getGame(gameId);
    if (!game) {
        throw error(404, 'Game not found');
    }

    if (game.hasStarted) {
        redirect(303, `/game/${gameId}`);
    }

    return getGameLobbyFromUserPerspective(game, userId);
}

export const actions = {
    'join-game': async ({ params, cookies }) => {
        const { gameId } = params;

        if (!gameId) {
            throw error(400, 'gameId not in address');
        }

        const userId = cookies.get('userId');
        if (!userId) {
            throw error(401, 'Unauthorized');
        }

        const user = await getUser(userId);

        if (!user) {
            throw error(401, 'Unauthorized');
        }

        const game = await getGame(gameId);
        if (!game) {
            throw error(404, 'Game not found');
        }

        if (game.hasStarted) {
            throw error(403, 'Game has already started');
        }

        const updatedGame = addPlayerToGame(game, userId);

        storeGame(updatedGame);
        broadcastGameLobbyUpdate('player-joined', updatedGame);
    },
    'start-game': async ({ params, cookies }) => {
        const { gameId } = params;

        if (!gameId) {
            throw error(400, 'gameId not in address');
        }

        const userId = cookies.get('userId');
        if (!userId) {
            throw error(401, 'Unauthorized');
        }

        const user = await getUser(userId);

        if (!user) {
            throw error(401, 'Unauthorized');
        }

        const game = await getGame(gameId);
        if (!game) {
            throw error(404, 'Game not found');
        }

        if (game.hasStarted) {
            throw error(400, 'Game has already started');
        }

        if (game.players.size < 2) {
            throw error(400, 'Not enough players');
        }

        const updatedGame = startGame(game);

        storeGame(updatedGame);
        broadcastGameLobbyUpdate('game-started', updatedGame);
    },
};

function addPlayerToGame(game: Game, userId: string): Game {
    const userCards = game.deck.slice(0, 14);
    const restOfDeck = game.deck.slice(14);

    const newPlayer: PlayerInGame = {
        userId,
        userCardsIds: userCards.map(card => card.id),
    };

    const newPlayersMap = new Map(game.players);
    newPlayersMap.set(userId, newPlayer);

    return {
        id: game.id,
        hasStarted: game.hasStarted,
        initiatingPlayerId: game.initiatingPlayerId,
        currentTurnPlayerId: game.currentTurnPlayerId,
        board: game.board,
        beforePlayerChangesData: game.beforePlayerChangesData,

        deck: restOfDeck,
        players: newPlayersMap,
    }
}
function startGame(game: Game): Game {
    const begginningPlayerId = getRandomElement(Array.from(game.players.keys()));

    return {
        id: game.id,
        initiatingPlayerId: game.initiatingPlayerId,
        players: game.players,
        board: game.board,
        beforePlayerChangesData: {
            board: game.board,
            playerCardIds: game.players.get(begginningPlayerId)?.userCardsIds || [],
        },
        deck: game.deck,
        hasStarted: true,
        currentTurnPlayerId: begginningPlayerId,
    }
}