import { error } from "@sveltejs/kit";
import type { User } from "../domain/user";
import { getUser } from "./storage/users";
import type { Game, PlayerInGame } from "./domain/game";
import { getGame } from "./storage/game";

export async function assertUserExist(userId: string | null | undefined): Promise<User> {
    if (!userId) {
        throw error(401, 'Unauthorized');
    }

    const user = await getUser(userId);

    if (!user) {
        throw error(401, 'Unauthorized');
    }

    return user;
}

type GameAssetionOptions = {
    hasGameStarted?: boolean,
    isUserPartOfTheGame?: boolean | null,
}

export async function assertValidGameState(userId: string, gameId: string | FormDataEntryValue | null | undefined, options: GameAssetionOptions = {}): Promise<Game> {
    const {
        hasGameStarted: expectGameHasStarted = true,
        isUserPartOfTheGame: expectUserBePartOfTheGame = true,
    } = options;
    if (!gameId) {
        throw error(400, 'gameId not in address');
    }

    if (typeof gameId !== 'string') {
        throw error(400, 'gameId is not a string in form');
    }

    const game = await getGame(gameId);

    if (!game) {
        throw error(404, 'Game not found');
    }

    if (expectGameHasStarted) {
        if (!game.hasStarted) {
            throw error(400, 'Game has not started');
        }
    } else {
        if (game.hasStarted) {
            throw error(400, 'Game has started');
        }
    }


    const currentPlayer = game.players.get(userId);
    const isUserPartOfTheGame = !!currentPlayer;

    if (expectUserBePartOfTheGame !== null && isUserPartOfTheGame !== expectUserBePartOfTheGame) {
        throw error(403, 'Forbidden');
    }

    return game;
}

export async function assertItIsPlayersTurn(userId: string, game: Game): Promise<PlayerInGame> {
    const currentPlayer = game.players.get(userId);

    if (!currentPlayer) {
        throw error(403, 'Forbidden');
    }

    if (game.currentTurnPlayerId !== userId) {
        throw error(400, 'Not your turn');
    }

    return currentPlayer;
}
