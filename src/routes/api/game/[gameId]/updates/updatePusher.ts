import type { GameUpdate } from "$lib/domain/updates";
import { getGameFromUserPerspective, type Game } from "$lib/server/domain/game";

type EventWriter = (event: GameUpdate) => void;

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

export function broadcastGameUpdate(updateType: GameUpdate['type'], game: Game) {
    const eventControllersByUserId = gameIdToUserEventController.get(game.id);

    eventControllersByUserId?.entries().forEach(([userId, eventSender]) => {
        const gameUpdate: GameUpdate = {
            type: updateType,
            updatedGameData: getGameFromUserPerspective(game, userId)
        };

        eventSender(gameUpdate);
    })
}