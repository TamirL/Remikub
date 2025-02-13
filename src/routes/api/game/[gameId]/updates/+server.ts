import { error, type RequestHandler } from "@sveltejs/kit";
import { subscribeUserToGameUpdates } from "./updatePusher";

let id = 0;

export const GET: RequestHandler = ({ request, params, cookies }) => {
    const gameId = params['gameId'];

    if (!gameId) {
        throw error(400, 'gameId not in address');
    }

    const userId = cookies.get('userId');

    if (!userId) {
        throw error(401, 'Unauthorized');
    }


    const stream = new ReadableStream<string>({
        start(controller) {
            const removeSubscription = subscribeUserToGameUpdates(gameId, userId, (data) => {
                let msg = `id: ${++id}\n`;
                msg += 'data: ' + data.trim().replace(/\n+/gm, '\ndata: ') + '\n\n';
                controller.enqueue(msg);
            });
            // When client disconnects, remove the writer from the channel
            request.signal.addEventListener('abort', () => {
                removeSubscription();
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no'
        }
    });

} 