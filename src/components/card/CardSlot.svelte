<script lang="ts">
	import type { CardSlotData } from '../../domain/board';
	import { canPutRealCardOnSlot, getCardDragDropContext } from '../../domain/card';
	import { getGameContext } from '../../domain/game';
	import Card from './Card.svelte';
	import DragabbleCard from './DragabbleCard.svelte';

	const { slot }: { slot: CardSlotData } = $props();
	const dragDropContext = getCardDragDropContext();
	const gameContext = getGameContext();

	let isCardOverThisSlot = $state(false);

	const amIAvailableForDraggedCard = $derived(
		!slot.card || (!!dragDropContext.draggedCard && slot.card.id === dragDropContext.draggedCard.id)
	);
	const isMatchingCardDragged = $derived(
		!!dragDropContext.draggedCard &&
			canPutRealCardOnSlot(dragDropContext.draggedCard, slot.expectedCard)
	);
	const isMatchingCardOverThisSlot = $derived(
		amIAvailableForDraggedCard && isMatchingCardDragged && isCardOverThisSlot
	);

	const highlight = $derived(amIAvailableForDraggedCard && isMatchingCardDragged);

	function handleDragEnter(event: DragEvent) {
		event.preventDefault();
		isCardOverThisSlot = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isCardOverThisSlot = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isCardOverThisSlot = false;
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

<div
	class={[highlight ? 'highlighted' : '', isMatchingCardOverThisSlot ? 'matching-card-over' : '']}
	role="region"
	aria-label="Drop zone for card"
	ondragenter={handleDragEnter}
	ondrop={handleDrop}
	ondragleave={handleDragLeave}
	ondragover={(ev) => {
		ev.preventDefault();
	}}
>
	<div class={dragDropContext.draggedCard ? 'is-any-card-dragged' : ''}>
		{#if slot.card}
			<DragabbleCard cardData={slot.card} draggedFrom={slot} />
		{:else}
			<div style:opacity={0.2}>
				<Card cardData={slot.expectedCard} />
			</div>
		{/if}
	</div>
</div>

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

	.matching-card-over {
		transform: scale(1.2);
		transition: transform 0.2s ease;
	}

	/* When any card is being dragged, we disable pointer events on all cards to prevent
	   the dragenter/dragleave events from firing on the cards themselves instead of their containers.
	   This ensures drag & drop works reliably when hovering over existing cards. */
	.is-any-card-dragged {
		pointer-events: none;
	}
</style>
