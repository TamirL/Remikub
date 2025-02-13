import type { GameFromPlayerPerspective } from '$lib/domain/game';
import { getGameFromUserPerspective } from '$lib/server/domain/game';
import { getGame } from '$lib/server/storage/game';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }): Promise<GameFromPlayerPerspective> => {
    const userId = cookies.get('userId');

    if (!userId) {
        throw error(401, 'Unauthorized');
    }

    const gameId = params.gameId;

    if (typeof gameId !== 'string' && !gameId) {
        throw error(400, 'Bad request');
    }

    const game = await getGame(gameId);

    if (!game) {
        throw error(404, 'Game not found');
    }

    const player = game.players.find(p => p.user.id === userId);

    if (!player) {
        throw error(403, 'Forbidden');
    }

    return getGameFromUserPerspective(game, userId);
}


