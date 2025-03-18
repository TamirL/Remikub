import { getGame, storeGame } from "$lib/server/storage/game";
import { getGameLobbyFromUserPerspective, type Game, type PlayerInGame } from "$lib/server/domain/game";
import { error, redirect } from "@sveltejs/kit";
import type { GameLobbyFromUserPerspective } from "$lib/domain/game";
import { getUser } from "$lib/server/storage/users.js";
import { broadcastGameLobbyUpdate } from "../../../api/game/[gameId]/lobby/updates/lobbyUpdatePusher.js";
import { getRandomElement } from "$lib/utils/arrayUtils.js";
import { isDefined } from "$lib/utils/utils.js";
import { assertUserExist, assertValidGameState } from "$lib/server/assertions.js";
import { USER_ID_COOKIE_FIELD } from "$lib/domain/user.js";

export async function load({ params, cookies }): Promise<GameLobbyFromUserPerspective> {
    const user = await assertUserExist(cookies.get(USER_ID_COOKIE_FIELD));

    const { gameId } = params;
    const game = await assertValidGameState(user.id, gameId, { hasGameStarted: false, isUserPartOfTheGame: null });

    return getGameLobbyFromUserPerspective(game, user.id);
}

export const actions = {
    'join-game': async ({ params, cookies }) => {
        const user = await assertUserExist(cookies.get(USER_ID_COOKIE_FIELD));

        const { gameId } = params;
        const game = await assertValidGameState(user.id, gameId, { hasGameStarted: false, isUserPartOfTheGame: false });

        const updatedGame = addPlayerToGame(game, user.id);

        storeGame(updatedGame);
        broadcastGameLobbyUpdate('player-joined', updatedGame);
    },
    'start-game': async ({ params, cookies }) => {
        const user = await assertUserExist(cookies.get(USER_ID_COOKIE_FIELD));

        const { gameId } = params;
        const game = await assertValidGameState(user.id, gameId, { hasGameStarted: false, isUserPartOfTheGame: true });

        if (game.players.size < 2) {
            throw error(400, 'Not enough players');
        }

        const updatedGame = startGame(game);

        storeGame(updatedGame);
        broadcastGameLobbyUpdate('game-started', updatedGame);

        redirect(303, `/game/${game.id}`);
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