
import type { GameFromPlayerPerspective } from "./game"


export type GameUpdate = {
    type: 'player-move' | 'user-cards-reorder',
    updatedGameData: GameFromPlayerPerspective,
}