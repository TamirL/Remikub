import type { GameFromPlayerPerspective } from "../game";
import type { GameUpdate } from "../updates";
import { source, type Source } from 'sveltekit-sse'


export default class UpdateManager {
    private _gameData: GameFromPlayerPerspective = $state({} as GameFromPlayerPerspective);

    constructor(initialGameData: GameFromPlayerPerspective, updateEventSource: Source | null) {
        this._gameData = initialGameData;
        console.log('UpdateManager.constructor');

        updateEventSource?.select('message').subscribe((data) => {
            console.log('UpdateManager.onMessage', { data });

            if (!data) {
                console.log('No data in message');
                return;
            }

            const gameUpdate: GameUpdate = JSON.parse(data);
            return this._gameData = gameUpdate.updatedGameData;
        });

    }

    public get gameData(): GameFromPlayerPerspective {
        return this._gameData;
    }
}