import type { Board, CardSlotData } from "$lib/domain/board";
import type { CardMoveAction } from "$lib/domain/gameActions";
import type { Game, PlayerInGame } from "$lib/server/domain/game";
import { getGame, storeGame } from "$lib/server/storage/game";
import { type RequestHandler } from "@sveltejs/kit";
import { broadcastGameUpdate } from "../updates/updatePusher";

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

    if (game?.currentTurnPlayerId !== userId) {
        return new Response(null, { status: 400 });
    }


    const user = game?.players.find(p => {
        return p.user.id === userId;
    });

    if (!user) {
        return new Response(null, { status: 403 });
    }

    const moveRequests: CardMoveAction[] = await request.json();

    const updatedGame = moveRequests.reduce((currentGame, moveRequest) => {
        return performMove(currentGame, userId, moveRequest);
    }, game);

    storeGame(updatedGame);
    broadcastGameUpdate('player-move', updatedGame);

    return new Response();
};

function performMove(game: Game, userId: string, cardMoveAction: CardMoveAction): Game {
    return ({
        id: game.id,
        currentTurnPlayerId: game.currentTurnPlayerId,
        deck: game.deck,
        players: performMoveOnPlayersCards(userId, game.players, cardMoveAction),
        board: performMoveOnBoard(game.board, cardMoveAction),
    })
}

function performMoveOnPlayersCards(currentTurnPlayerId: string, players: PlayerInGame[], moveAction: CardMoveAction): PlayerInGame[] {
    return players.map(player => {
        if (player.user.id !== currentTurnPlayerId) {
            return player;
        }

        return {
            ...player,
            userCards: player.userCards.filter(userCard => userCard.id !== moveAction.from.cardId)
        };
    });
}

function performMoveOnBoard(board: Board, moveAction: CardMoveAction): Board {
    return {
        runs: board.runs.map(run => {
            return {
                ...run,
                slots: performMoveOnSet(run.slots, moveAction),
            }
        }),
        numberGroups: board.numberGroups.map(numberGroup => {
            return {
                ...numberGroup,
                slots: performMoveOnSet(numberGroup.slots, moveAction),
            }
        }),
    };
}

function performMoveOnSet(slots: CardSlotData[], moveAction: CardMoveAction): CardSlotData[] {
    return slots.map((slot): CardSlotData => {
        if (slot.cardId === moveAction.from.cardId) {
            return {
                ...slot,
                cardId: null
            };
        }

        if (slot.id === moveAction.to.slotId) {
            return {
                ...slot,
                cardId: moveAction.from.cardId,
            }
        }

        return slot;
    })
}