import { createOrUpdateUser } from "$lib/server/storage/users";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { USER_ID_COOKIE_FIELD } from "$lib/domain/user";

export const actions: Actions = {
    default: async ({ url, request, cookies }) => {
        const formData = await request.formData()
        const userName = formData.get('name');

        if (!userName || typeof userName !== 'string') {
            return error(400, 'Field Missing: name');
        }

        const userId = crypto.randomUUID();
        cookies.set(USER_ID_COOKIE_FIELD, userId, { secure: false, path: '/' });

        const user = await createOrUpdateUser(userId, userName);

        const redirectUrl = url.searchParams.get('redirectUrl');

        return { user, redirectUrl };
    }
};
