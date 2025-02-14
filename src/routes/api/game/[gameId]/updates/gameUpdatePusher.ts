import type { GameUpdate, InProgressGameUpdate } from "$lib/domain/updates";
import { getGameFromUserPerspective, type Game } from "$lib/server/domain/game";

type EventWriter = (event: InProgressGameUpdate) => void;

const gameIdToUserEventController: Map<string, Map<string, EventWriter>> = new Map();

export function subscribeUserToGameUpdates(gameId: string, userId: string, userEventWriter: EventWriter): () => void {
    if (!gameIdToUserEventController.has(gameId)) {
        gameIdToUserEventController.set(gameId, new Map());
    }

    gameIdToUserEventController.get(gameId)?.set(userId, userEventWriter);

    return () => {
        gameIdToUserEventController.get(gameId)?.delete(userId);

        if (!gameIdToUserEventController.get(gameId)?.size) {
            gameIdToUserEventController.delete(gameId);
        }
    }
}

export function broadcastGameUpdate(updateType: InProgressGameUpdate['type'], game: Game) {
    const eventControllersByUserId = gameIdToUserEventController.get(game.id);

    eventControllersByUserId?.entries().forEach(async ([userId, eventSender]) => {
        const gameUpdate: InProgressGameUpdate = {
            type: updateType,
            data: await getGameFromUserPerspective(game, userId)
        };

        eventSender(gameUpdate);
    })
}