<script lang="ts">
	import type { CardSlotData } from '../domain/board';
	import { emptyBoard } from '../domain/board';
	import { canPutRealCardOnSlot, getCardDragDropContext, type RealCardData } from '../domain/card';
	import CardSlot from './card/CardSlot.svelte';

	let board = emptyBoard;
	const dragDropContext = getCardDragDropContext();

	function onDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
	}
</script>

<div class="board-main" role="region" ondragover={onDragOver} ondrop={onDrop}>
	<div class="board-sets">
		{#each board.sets as set}
			{@render seriesOfSlots(set.slots, dragDropContext.draggedCard)}
		{/each}
	</div>
	<div class="board-runs">
		{#each board.allRuns as run}
			{@render seriesOfSlots(run.slots, dragDropContext.draggedCard)}
		{/each}
	</div>
</div>

{#snippet seriesOfSlots(slots: CardSlotData[], currentDraggedCard: RealCardData | null)}
	<div class="board-series">
		{#each slots as slot}
			<CardSlot
				{slot}
				highlight={!!currentDraggedCard &&
					canPutRealCardOnSlot(currentDraggedCard, slot.expectedCard)}
			/>
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

	.board-sets {
		display: flex;
		flex-direction: column;
		gap: 9px 14px;
		flex-wrap: wrap;
		flex: 1;

		align-content: flex-start;
	}

	.board-runs {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}

	.board-series {
		display: flex;
		flex-direction: row;
		gap: 1px;
	}
</style>
