<script lang="ts">
	import { setCardDragDropContext } from '$lib/domain/cards';
	import Board from './Board.svelte';
	import UserCards from './UserCards.svelte';
	import { getGameContext } from '$lib/domain/game';
	import PlayerCard from '$lib/components/PlayerCard.svelte';

	const dragDropContext = $state({ draggedCard: null, draggedFrom: null });
	setCardDragDropContext(dragDropContext);
	const gameContext = getGameContext();
</script>

<div class="game">
	<div class="top-part">
		<Board />
		<div class="players-side-panel">
			{#each gameContext.gameManager.players as player}
				<PlayerCard
					{player}
					isItTheirTurn={player.id === gameContext.gameManager.currentTurnUserId}
				/>
			{/each}
		</div>
	</div>
	<UserCards cards={gameContext.gameManager.userCards} />
</div>

<style>
	.game {
		display: flex;
		flex-direction: column;

		flex: 1;
		overflow: auto;
		min-height: 0;
	}

	.top-part {
		display: flex;
		flex-direction: row;

		flex: 1;
	}

	.players-side-panel {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 10px;
		margin: 10px;

		width: 150px;
	}
</style>
