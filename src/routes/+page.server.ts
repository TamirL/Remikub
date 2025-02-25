import { redirect, type Actions } from "@sveltejs/kit";
import { createGame } from "$lib/server/domain/game";
import { storeGame } from "$lib/server/storage/game";
import { assertUserExist, assertValidGameState } from "$lib/server/assertions";
import { USER_ID_COOKIE_FIELD } from "$lib/domain/user";

export const actions: Actions = {
    'create-game': async ({ cookies }) => {
        const userId = cookies.get('userId');
        const user = await assertUserExist(userId);

        const game = await createGame(user.id);
        await storeGame(game);

        console.log('game created', game.id)

        redirect(303, '/game/' + game.id + '/lobby');
    },
    'join-lobby': async ({ request, cookies }) => {
        const formData = await request.formData();

        const gameId = formData.get('gameId');

        const user = await assertUserExist(cookies.get(USER_ID_COOKIE_FIELD));
        const game = await assertValidGameState(user.id, gameId, { hasGameStarted: false, isUserPartOfTheGame: false })

        redirect(303, '/game/' + gameId + '/lobby');
    }
};
