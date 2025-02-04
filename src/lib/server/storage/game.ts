import type { Game } from "$lib/server/domain/game";

const games: Map<string, Game> = new Map();

export async function getGame(gameId: string): Promise<Game | null> {
    const game = games.get(gameId);
    return game ?? null;
}

export async function storeGame(game: Game): Promise<Game> {
    games.set(game.id, game);
    return game;
}




