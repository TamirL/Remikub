<script lang="ts">
	import type { CardSlotData } from '../domain/board';
	import { emptyBoard } from '../domain/board';
	import type { CardData } from '../domain/card';
	import CardSlot from './CardSlot.svelte';

	let board = emptyBoard;

	let currentDraggedCard: CardData | null = $state(null);

	function onDragging(card: CardData, isDragging: boolean) {
		currentDraggedCard = isDragging ? card : null;
	}
</script>

<div class="board-main">
	<div class="board-sets">
		{#each board.sets as set}
			{@render seriesOfSlots(set.slots, currentDraggedCard)}
		{/each}
	</div>
	<div class="board-runs">
		{#each board.allRuns as run}
			{@render seriesOfSlots(run.slots, currentDraggedCard)}
		{/each}
	</div>
</div>

{#snippet seriesOfSlots(slots: CardSlotData[], currentDraggedCard: CardData | null)}
	<div class="board-series">
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
