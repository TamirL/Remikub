import { error, type RequestHandler } from "@sveltejs/kit";
import { subscribeUserToGameUpdates } from "./updatePusher";
import { produce } from "sveltekit-sse";

let id = 0;

export const POST: RequestHandler = ({ request, params, cookies }) => {
    const gameId = params['gameId'];

    if (!gameId) {
        throw error(400, 'gameId not in address');
    }

    const userId = cookies.get('userId');

    if (!userId) {
        throw error(401, 'Unauthorized');
    }

    return produce(async function start({ emit }) {
        const removeSubscription = subscribeUserToGameUpdates(gameId, userId, (data) => {
            const { error } = emit('message', JSON.stringify(data));
            if (error) {
                console.error('updates error', error);
            }
        });

        return () => {
            console.log('closing connection');
            removeSubscription();
        };
    })
} 