import type { GameLobbyUpdate } from "$lib/domain/updates";
import { getGameLobbyFromUserPerspective, type Game } from "$lib/server/domain/game";

type EventWriter = (event: GameLobbyUpdate) => void;

const gameIdToUserEventController: Map<string, Map<string, EventWriter>> = new Map();

export function subscribeUserToGameLobbyUpdates(gameId: string, userId: string, userEventWriter: EventWriter): () => void {
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

export function broadcastGameLobbyUpdate(updateType: GameLobbyUpdate['type'], game: Game) {
    const eventControllersByUserId = gameIdToUserEventController.get(game.id);

    eventControllersByUserId?.entries().forEach(async ([userId, eventSender]) => {
        const gameUpdate: GameLobbyUpdate = {
            type: updateType,
            data: await getGameLobbyFromUserPerspective(game, userId)
        };

        eventSender(gameUpdate);
    })
}