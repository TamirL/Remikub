
import type { GameFromPlayerPerspective } from "./game"


export type GameUpdate = {
    type: 'player-move',
    updatedGameData: GameFromPlayerPerspective,
}