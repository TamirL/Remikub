import type { GameFromPlayerPerspective } from "../game";
import type { GameUpdate } from "../updates";
import { source, type Source } from 'sveltekit-sse'


export default class UpdateManager<TData, TUpdateObject extends GameUpdate<TData>> {
    private _data: TData = $state({} as TData);

    constructor(initialGameData: TData, updateEventSource: Source | null) {
        this._data = initialGameData;
        updateEventSource?.select('message').subscribe((data) => {
            if (!data) {
                console.log('No data in message');
                return;
            }

            const gameUpdate: TUpdateObject = JSON.parse(data);
            return this._data = gameUpdate.data;
        });
    }

    public get mostRecentData(): TData {
        return this._data;
    }
}