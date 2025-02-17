<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { CardSlotData } from '$lib/domain/board';
	import { allCardsById, canPutRealCardOnSlot, getCardDragDropContext } from '$lib/domain/cards';
	import { getGameContext } from '$lib/domain/game';
	import DragabbleCard from '$lib/components/DragabbleCard.svelte';

	const { slot }: { slot: CardSlotData } = $props();
	const dragDropContext = getCardDragDropContext();
	const gameContext = getGameContext();

	let isCardOverThisSlot = $state(false);

	const amIAvailableForDraggedCard = $derived(
		gameContext.gameManager.isItMyTurn &&
			(!slot.cardId ||
				(!!dragDropContext.draggedCard && slot.cardId === dragDropContext.draggedCard.id))
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
		if (!gameContext.gameManager.isItMyTurn) {
			return;
		}

		event.preventDefault();
		isCardOverThisSlot = true;
	}

	function handleDragLeave(event: DragEvent) {
		if (gameContext.gameManager.isItMyTurn) {
			event.preventDefault();
		}

		isCardOverThisSlot = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isCardOverThisSlot = false;
		if (!dragDropContext.draggedCard) {
			console.error('No card to drop');
			return;
		}

		if (!gameContext.gameManager.isItMyTurn) {
			console.error('Not your turn');
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
		{#if slot.cardId && allCardsById.has(slot.cardId)}
			<DragabbleCard cardData={allCardsById.get(slot.cardId)!} draggedFrom={slot} />
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
