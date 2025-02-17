<script lang="ts">
	import { getGameContext } from '$lib/domain/game';
	import type { User } from '$lib/domain/user';
	import PlayerCard from './PlayerCard.svelte';

	const { players, currentTurnUserId }: { players: User[]; currentTurnUserId: string | null } =
		$props();

	const gameContext = getGameContext();
</script>

<div class="players-panel">
	{#each players as player}
		<PlayerCard {player} isItTheirTurn={!!currentTurnUserId && player.id === currentTurnUserId} />
	{/each}
</div>

<style>
	.players-panel {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		align-items: stretch;

		gap: 10px;
	}
</style>
