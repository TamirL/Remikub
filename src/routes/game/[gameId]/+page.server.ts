import { calcIsBoardValid, type GameFromPlayerPerspective } from '$lib/domain/game';
import { getGameFromUserPerspective, type Game } from '$lib/server/domain/game';
import { storeGame } from '$lib/server/storage/game';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { broadcastGameUpdate } from '../../api/game/[gameId]/updates/gameUpdatePusher';
import { hasUserMadeContributionsToTheBoard } from '$lib/domain/board';
import { updatePlayersData } from '$lib/server/domain/players';
import { isDefined } from '$lib/utils/utils';
import { isSetsEqual } from '$lib/utils/setUtils';
import type { UserCardId } from '$lib/domain/userCards';
import { assertItIsPlayersTurn, assertUserExist, assertValidGameState } from '$lib/server/assertions';

export const load: PageServerLoad = async ({ params, cookies }): Promise<GameFromPlayerPerspective> => {
    const userId = cookies.get('userId');
    const user = await assertUserExist(userId);

    const game = await assertValidGameState(user.id, params.gameId);

    return getGameFromUserPerspective(game, user.id);
}

export const actions = {
    'finish-turn': async ({ params, cookies }) => {
        const userId = cookies.get('userId');
        const user = await assertUserExist(userId);

        const { gameId } = params;

        const game = await assertValidGameState(user.id, gameId);
        const currentPlayer = await assertItIsPlayersTurn(user.id, game);

        const isGameValid = calcIsBoardValid(game.board);

        if (!isGameValid) {
            throw error(400, 'Board is not valid');
        }

        if (!hasUserMadeContributionsToTheBoard({ board: game.board, playerCardIds: currentPlayer.userCardsIds.filter(isDefined) }, game.beforePlayerChangesData)) {
            throw error(400, 'You have not made any contributions to the table');
        }

        const updatedGame = moveToTheNextPerson(game);

        storeGame(updatedGame);

        broadcastGameUpdate('turn-finished', updatedGame);
    },
    'undo-board-changes': async ({ params, cookies }) => {
        const userId = cookies.get('userId');
        const user = await assertUserExist(userId);

        const { gameId } = params;

        const game = await assertValidGameState(user.id, gameId);
        await assertItIsPlayersTurn(user.id, game);

        const updatedGame = undoBoardChanges(game);

        storeGame(updatedGame);

        broadcastGameUpdate('undo-user-changes', updatedGame);
    },
    'draw-card': async ({ params, cookies }) => {
        const userId = cookies.get('userId');
        const user = await assertUserExist(userId);

        const { gameId } = params;

        const game = await assertValidGameState(user.id, gameId);
        await assertItIsPlayersTurn(user.id, game);

        let updatedGame = undoBoardChanges(game);
        updatedGame = drawCard(updatedGame);
        updatedGame = moveToTheNextPerson(updatedGame);

        storeGame(updatedGame);
        broadcastGameUpdate('undo-user-changes', updatedGame);
    }
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
            playerCardIds: nextPlayer.userCardsIds.filter(isDefined),
        },
        players: game.players,
        board: game.board,
        currentTurnPlayerId: nextPlayer.userId,
    }
}
function undoBoardChanges(game: Game): Game {
    const userCardsBeforeChanges = new Set(game.beforePlayerChangesData.playerCardIds.filter(isDefined));
    const userCardsAfterChanges = new Set(game.players.get(game.currentTurnPlayerId)?.userCardsIds.filter(isDefined) ?? []);

    let userCardsAfterUndo: UserCardId[];

    // If all that the user has done was shuffle his cards, don't return them to the old locations
    if (isSetsEqual(userCardsBeforeChanges, userCardsAfterChanges)) {
        userCardsAfterUndo = game.players.get(game.currentTurnPlayerId)?.userCardsIds ?? [];
    } else {
        userCardsAfterUndo = game.beforePlayerChangesData.playerCardIds;
    }

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
                userCardsIds: userCardsAfterUndo,
            };
        }),
        board: game.beforePlayerChangesData.board,
    }
}

function drawCard(game: Game): Game {
    const [drawenCard, ...restOfDeck] = game.deck

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
