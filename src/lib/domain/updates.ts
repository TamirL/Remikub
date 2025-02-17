
import type { GameFromPlayerPerspective, GameLobbyFromUserPerspective } from "./game"


export type GameUpdate<TData> = {
    data: TData,
}

export type InProgressGameUpdate = GameUpdate<GameFromPlayerPerspective> & {
    type: 'player-move' | 'user-cards-reorder' | 'turn-finished' | 'undo-user-changes',
}

export type GameLobbyUpdate = GameUpdate<GameLobbyFromUserPerspective> & {
    type: 'player-joined' | 'game-started',
}