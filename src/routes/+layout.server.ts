import { USER_ID_COOKIE_FIELD, type User } from "$lib/domain/user";
import { getUser } from "$lib/server/storage/users";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

type LayoutLoadData = {
    isLogin: boolean;
    loggedInUser: User | null;
}

export const load: LayoutServerLoad<LayoutLoadData> = async ({ url, cookies, params }): Promise<LayoutLoadData> => {
    const userId = cookies.get(USER_ID_COOKIE_FIELD);

    const user = userId ? await getUser(userId) : null;

    const isLogin = url.pathname.toLowerCase().startsWith('/login');

    if (isLogin && user) {
        return redirect(303, url.searchParams.get('redirectUrl') ?? '/')
    }

    if (!isLogin && !user) {
        return redirect(303, '/login?redirectUrl=' + url.href);
    }

    return {
        isLogin,
        loggedInUser: user,
    }
}