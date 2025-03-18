<script lang="ts">
	import type { CardSlotData } from '$lib/domain/board';
	import { cardDragDropContext } from '$lib/domain/cards';
	import { getGameContext } from '$lib/domain/game';
	import CardSlot from './CardSlot.svelte';

	let gameManager = getGameContext().gameManager;
	const dragDropContext = cardDragDropContext.get();

	const minimalVisibleBoard = $derived(
		gameManager.getMinimalVisibleBoard(
			gameManager.isItMyTurn ? (dragDropContext.current?.draggedCard ?? null) : null
		)
	);

	function onDragOver(event: DragEvent) {
		if (gameManager.isItMyTurn) {
			event.preventDefault();
		}
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
	}
</script>

<div
	class={['board-main', gameManager.isBoardValid ? 'valid' : 'invalid']}
	role="region"
	ondragover={onDragOver}
	ondrop={onDrop}
>
	<div class="board-number-groups">
		{#each minimalVisibleBoard.numberGroups as numberGroup (numberGroup.id)}
			{@render seriesOfSlots(numberGroup.slots)}
		{/each}
	</div>
	<div class="board-runs">
		{#each minimalVisibleBoard.runs as run (run.id)}
			{@render seriesOfSlots(run.slots)}
		{/each}
	</div>
</div>

{#snippet seriesOfSlots(slots: CardSlotData[])}
	<div class="board-set">
		{#each slots as slot}
			<CardSlot {slot} />
		{/each}
	</div>
{/snippet}

<style>
	.board-main {
		display: flex;
		flex-direction: row;
		gap: 50px;

		flex: 1;

		background-color: #222222;
		padding: 20px;
		overflow: auto;
		min-height: 0;
	}

	.board-main.valid {
		background-color: #222222;
	}

	.board-main.invalid {
		background-color: #441313;
	}

	.board-number-groups {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 9px 14px;
		flex-wrap: wrap;
		flex: 1;

		align-content: flex-start;
	}

	.board-runs {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 9px;
	}

	.board-set {
		display: flex;
		flex-direction: row;
		gap: 1px;
	}
</style>
