import { getGameFromUserPerspective, type Game } from "$lib/server/domain/game";

type EventWriter = (event: string) => void;

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

let id = 0;
const event = 'message';

export function broadcastGameUpdate(game: Game) {
    const eventControllersByUserId = gameIdToUserEventController.get(game.id);

    eventControllersByUserId?.entries().forEach(([userId, eventSender]) => {
        const data = JSON.stringify(getGameFromUserPerspective(game, userId));
        eventSender(data);
    })
}