import type { GameFromPlayerPerspective } from "../game";
import type { GameUpdate } from "../updates";

export default class UpdateManager {
    private _gameData: GameFromPlayerPerspective = $state({} as GameFromPlayerPerspective);

    private _updateEventSource: EventSource | null;

    constructor(initialGameData: GameFromPlayerPerspective, updateEventSource: EventSource | null) {
        this._gameData = initialGameData;
        this._updateEventSource = updateEventSource;

        if (this._updateEventSource) {
            this._updateEventSource.onmessage = this.onMessage.bind(this);
            this._updateEventSource.onerror = (ev) => {
                console.error('UpdateManager.onMessage', ev);
            };
            this._updateEventSource.onopen = (ev) => {
                console.log('UpdateManager.onOpen', ev);
            };
        }
    }

    public get gameData(): GameFromPlayerPerspective {
        return this._gameData;
    }

    onMessage = (ev: MessageEvent<GameUpdate>) => {
        console.log('UpdateManager.onMessage', ev.data);
        this._gameData = ev.data.updatedGameData;
    }
}