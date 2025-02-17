import { createOrUpdateUser, createUserUniqueId, getUser } from "$lib/server/storage/users";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { createGame } from "$lib/server/domain/game";
import { storeGame } from "$lib/server/storage/game";
import { USER_ID_COOKIE_FIELD } from "$lib/domain/user";

export const load: PageServerLoad = async ({ cookies }) => {
    const userId = cookies.get('userId');
    let user = userId ? await getUser(userId) : null;

    if (!user) {
        user = {
            id: createUserUniqueId(),
            name: '',
        }
    }

    cookies.set(USER_ID_COOKIE_FIELD, user.id, { path: '/', httpOnly: false });

    return user;
}

export const actions: Actions = {
    'create-game': async ({ request, cookies }) => {
        const formData = await request.formData();

        const userName = formData.get('userName');
        if (!userName || typeof userName !== 'string') {
            return fail(400, { userName, missing: true });
        }

        const user = await createOrUpdateUser(cookies.get('userId') ?? null, userName);

        const game = await createGame(user.id);
        await storeGame(game);

        redirect(303, '/game/' + game.id + '/lobby');
    },
    'join-lobby': async ({ request, cookies }) => {
        const formData = await request.formData();
        const userName = formData.get('userName');
        if (!userName || typeof userName !== 'string') {
            return fail(400, { userName, missing: true });
        }

        const gameId = formData.get('gameId');
        if (!gameId || typeof gameId !== 'string') {
            return fail(400, { gameId, missing: true });
        }

        const user = await createOrUpdateUser(cookies.get('userId') ?? null, userName);

        redirect(303, '/game/' + gameId + '/lobby');
    }
};
