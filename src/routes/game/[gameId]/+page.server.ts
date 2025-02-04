import type { GameFromPlayerPerspective } from '$lib/domain/game';
import { getGame } from '$lib/server/storage/game';
import { error } from '@sveltejs/kit';

export const load = async ({ params, cookies }): Promise<GameFromPlayerPerspective> => {
    const userId = cookies.get('userId');

    if (!userId) {
        throw error(401, 'Unauthorized');
    }

    const gameId = params.gameId;
    const game = await getGame(gameId);

    console.log('game', !!game, gameId, userId);

    if (!game) {
        throw error(404, 'Game not found');
    }

    const player = game.players.find(p => p.user.id === userId);

    if (!player) {
        throw error(403, 'Forbidden');
    }

    return {
        id: game.id,
        players: game.players.map(p => p.user),
        board: game.board,
        deckSize: game.deck.length,
        userCards: player.userCards
    };
}


