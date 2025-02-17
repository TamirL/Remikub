import type { PlayerInGame } from "./game";

export function updatePlayersData(players: Map<string, PlayerInGame>, currentTurnPlayerId: string, actionOnCurrentTurnPlayer: (player: PlayerInGame) => PlayerInGame): Map<string, PlayerInGame> {
    const playersAfterTurn = players.entries().map(([userId, player]): [string, PlayerInGame] => {
        if (userId !== currentTurnPlayerId) {
            return [userId, player];
        }

        const updatedPlayer = actionOnCurrentTurnPlayer(player);

        return [userId, updatedPlayer];
    });

    return new Map(playersAfterTurn);
}