import { redirect, type Handle } from '@sveltejs/kit';
import { log } from 'console';

export const handle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/api')) {
        return await resolve(event);
    }

    const response = await resolve(event);

    if (response.status !== 401) {
        return response;
    }

    const currentUrl = event.url.href;

    log(event)
    return redirect(303, `/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
};