<script lang="ts">
	import type { CardSlotData } from '../../domain/board';
	import { getCardDragDropContext } from '../../domain/card';
	import { getGameContext } from '../../domain/game';
	import Card from './Card.svelte';
	import DragabbleCard from './DragabbleCard.svelte';

	const { slot, highlight }: { slot: CardSlotData; highlight: boolean } = $props();
	const dragDropContext = getCardDragDropContext();
	const gameContext = getGameContext();

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		if (!dragDropContext.draggedCard) {
			console.error('No card to drop');
			return;
		}

		if (dragDropContext.draggedFrom) {
			gameContext.gameManager.moveCardFromSlot(dragDropContext.draggedFrom, slot);
		} else {
			gameContext.gameManager.moveCardFromUserCards(dragDropContext.draggedCard, slot);
		}
	}
</script>

{#if slot.card}
	<div class={highlight ? 'highlighted' : ''}>
		<DragabbleCard cardData={slot.card} draggedFrom={slot} />
	</div>
{:else}
	<div
		class={highlight ? 'highlighted' : ''}
		role="region"
		aria-label="Drop zone for card"
		ondrop={handleDrop}
	>
		<div style:opacity={0.2}>
			<Card cardData={slot.expectedCard} />
		</div>
	</div>
{/if}

<style>
	.highlighted {
		outline: 2px solid rgba(255, 255, 0, 0);
		animation: glow 1.5s ease-in-out infinite alternate;
	}

	@keyframes glow {
		from {
			outline-color: rgba(255, 255, 0, 0.5);
		}
		to {
			outline-color: rgba(255, 255, 0, 1);
		}
	}
</style>
