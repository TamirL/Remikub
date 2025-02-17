<script lang="ts">
	import { setCardDragDropContext } from '$lib/domain/cards';
	import Board from './Board.svelte';
	import UserCards from './UserCards.svelte';
	import { getGameContext } from '$lib/domain/game';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import UndoBoardChangesButton from './UndoBoardChangesButton.svelte';
	import { areBoardsEqual, hasUserMadeContributionsToTheTable } from '$lib/domain/board';
	import FinishTurnButton from './FinishTurnButton.svelte';
	import DrawCardButton from './DrawCardButton.svelte';

	const dragDropContext = $state({ draggedCard: null, draggedFrom: null });
	setCardDragDropContext(dragDropContext);
	const gameContext = getGameContext();

	const canFinishTurn = $derived.by(() => {
		if (!gameContext.gameManager.isItMyTurn) {
			return false;
		}

		if (!gameContext.gameManager.beforePlayerChangesData) {
			return false;
		}

		const hasUserMadeContributions = hasUserMadeContributionsToTheTable(
			{
				board: gameContext.gameManager.board,
				playerCardIds: gameContext.gameManager.userCards.map((p) => p.id)
			},
			gameContext.gameManager.beforePlayerChangesData
		);

		return hasUserMadeContributions && gameContext.gameManager.isBoardValid;
	});

	const isItMyTurn = gameContext.gameManager.isItMyTurn;
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
	<div class="bottom-part">
		<UserCards cards={gameContext.gameManager.userCards} />
		<div class="user-actions">
			<UndoBoardChangesButton />
			{#if isItMyTurn && canFinishTurn}
				<FinishTurnButton />
			{:else}
				<DrawCardButton />
			{/if}
		</div>
	</div>
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

	.bottom-part {
		display: flex;
		flex-direction: row;

		flex: 0 0 auto;
	}

	.user-actions {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
