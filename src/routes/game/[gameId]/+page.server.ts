import { calcIsBoardValid, type GameFromPlayerPerspective } from '$lib/domain/game';
import { getGameFromUserPerspective, type Game, type PlayerInGame } from '$lib/server/domain/game';
import { getGame, storeGame } from '$lib/server/storage/game';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { broadcastGameUpdate } from '../../api/game/[gameId]/updates/gameUpdatePusher';
import { hasUserMadeContributionsToTheTable } from '$lib/domain/board';
import { updatePlayersData } from '$lib/server/domain/players';

export const load: PageServerLoad = async ({ params, cookies }): Promise<GameFromPlayerPerspective> => {
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

    if (!game.hasStarted) {
        redirect(303, `/game/${gameId}/lobby`);
    }

    const player = game.players.get(userId);

    if (!player) {
        throw error(403, 'Forbidden');
    }

    return getGameFromUserPerspective(game, userId);
}

export const actions = {
    'finish-turn': async ({ params, cookies }) => {
        const userId = cookies.get('userId');
        const { gameId } = params;
        const { game, currentPlayer } = await assertValidUserAndGameState(userId, gameId);

        const isGameValid = calcIsBoardValid(game.board);

        if (!isGameValid) {
            throw error(400, 'Board is not valid');
        }

        if (!hasUserMadeContributionsToTheTable({ board: game.board, playerCardIds: currentPlayer.userCardsIds }, game.beforePlayerChangesData)) {
            throw error(400, 'You have not made any contributions to the table');
        }

        const updatedGame = moveToTheNextPerson(game);

        storeGame(updatedGame);

        broadcastGameUpdate('turn-finished', updatedGame);
    },
    'undo-board-changes': async ({ params, cookies }) => {
        const userId = cookies.get('userId');
        const { gameId } = params;
        const { game } = await assertValidUserAndGameState(userId, gameId);

        const updatedGame = undoBoardChanges(game);

        storeGame(updatedGame);

        broadcastGameUpdate('undo-user-changes', updatedGame);
    },
    'draw-card': async ({ params, cookies }) => {
        const userId = cookies.get('userId');
        const { gameId } = params;
        const { game } = await assertValidUserAndGameState(userId, gameId);

        let updatedGame = undoBoardChanges(game);
        updatedGame = drawCard(updatedGame);
        updatedGame = moveToTheNextPerson(updatedGame);

        storeGame(updatedGame);
        broadcastGameUpdate('undo-user-changes', updatedGame);
    }
}

async function assertValidUserAndGameState(userId: string | undefined, gameId: string | undefined): Promise<{ game: Game; currentPlayer: PlayerInGame; }> {
    if (!userId) {
        throw error(401, 'Unauthorized');
    }

    if (!gameId) {
        throw error(400, 'gameId not in address');
    }

    const game = await getGame(gameId);

    if (!game) {
        throw error(404, 'Game not found');
    }

    const currentPlayer = game.players.get(userId);

    if (!currentPlayer) {
        throw error(403, 'Forbidden');
    }

    if (game.currentTurnPlayerId !== userId) {
        throw error(400, 'Not your turn');
    }

    if (!game.hasStarted) {
        throw error(400, 'Game has not started');
    }

    return { game, currentPlayer };
}

function moveToTheNextPerson(game: Game): Game {
    const playersArray = Array.from(game.players.values());
    const currentPlayerIndex = playersArray.findIndex(p => p.userId === game.currentTurnPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % playersArray.length;
    const nextPlayer = playersArray[nextPlayerIndex];

    return {
        id: game.id,
        hasStarted: game.hasStarted,
        initiatingPlayerId: game.initiatingPlayerId,
        deck: game.deck,
        beforePlayerChangesData: {
            board: game.board,
            playerCardIds: nextPlayer.userCardsIds,
        },
        players: game.players,
        board: game.board,
        currentTurnPlayerId: nextPlayer.userId,
    }
}
function undoBoardChanges(game: Game): Game {
    return {
        id: game.id,
        hasStarted: game.hasStarted,
        initiatingPlayerId: game.initiatingPlayerId,
        deck: game.deck,
        beforePlayerChangesData: game.beforePlayerChangesData,
        currentTurnPlayerId: game.currentTurnPlayerId,

        players: updatePlayersData(game.players, game.currentTurnPlayerId, (player) => {
            return {
                userId: player.userId,
                userCardsIds: game.beforePlayerChangesData.playerCardIds,
            };
        }),
        board: game.beforePlayerChangesData.board,
    }
}

function drawCard(game: Game): Game {
    const [drawenCard, ...restOfDeck] = game.deck

    console.log('drawCard', game.deck.length, restOfDeck.length, drawenCard);

    return {
        id: game.id,
        hasStarted: game.hasStarted,
        initiatingPlayerId: game.initiatingPlayerId,
        deck: restOfDeck,
        beforePlayerChangesData: game.beforePlayerChangesData,
        currentTurnPlayerId: game.currentTurnPlayerId,

        players: updatePlayersData(game.players, game.currentTurnPlayerId, (player) => {
            return {
                userId: player.userId,
                userCardsIds: [...player.userCardsIds, drawenCard.id],
            };
        }),
        board: game.beforePlayerChangesData.board,
    }
}
