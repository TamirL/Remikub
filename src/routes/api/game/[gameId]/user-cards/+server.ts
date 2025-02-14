import type { Game, PlayerInGame } from "$lib/server/domain/game";
import { getGame, storeGame } from "$lib/server/storage/game";
import { isSetsEqual } from "$lib/utils/setUtils";
import type { RequestHandler } from "@sveltejs/kit";
import { broadcastGameUpdate } from "../updates/gameUpdatePusher";
import type { ReorderUserCardsAction } from "$lib/domain/gameActions";

export const POST: RequestHandler = async ({ request, params, cookies }) => {
    const userId = cookies.get('userId');

    if (!userId) {
        return new Response(null, { status: 401 });
    }

    const gameId = params.gameId;

    if (!gameId) {
        return new Response(null, { status: 400 });
    }

    const game = await getGame(gameId);

    if (!game) {
        return new Response(null, { status: 404 });
    }

    const thisPlayer = game.players.find(p => {
        return p.userId === userId;
    });

    if (!isSetsEqual(new Set(thisPlayer?.userCardsIds), new Set(thisPlayer?.userCardsIds))) {
        return new Response(null, { status: 400 });
    }

    const action: ReorderUserCardsAction = await request.json();

    const updatedGame = performUserCardsReorder(game, userId, action.cardIdsNewOrder);
    storeGame(updatedGame);
    broadcastGameUpdate('user-cards-reorder', updatedGame);

    return new Response();
}

function performUserCardsReorder(game: Game, userId: string, newCardIdsOrder: number[]): Game {
    return ({
        id: game.id,
        hasStarted: game.hasStarted,
        initiatingPlayerId: game.initiatingPlayerId,
        currentTurnPlayerId: game.currentTurnPlayerId,
        deck: game.deck,
        players: reorderUserCards(game.players, userId, newCardIdsOrder),
        board: game.board,
    })
}

function reorderUserCards(players: PlayerInGame[], userId: string, newCardIdsOrder: number[]): PlayerInGame[] {
    return players.map(player => {
        if (player.userId !== userId) {
            return player;
        }

        return {
            userId: player.userId,
            userCardsIds: newCardIdsOrder,
        };
    });
}
