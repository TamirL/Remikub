<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { CardSlotData } from '$lib/domain/board';
	import { allCardsById, canPutRealCardOnSlot, getCardDragDropContext } from '$lib/domain/cards';
	import { getGameContext } from '$lib/domain/game';
	import DragabbleCard from '$lib/components/DragabbleCard.svelte';
	import DragDropDropArea from '$lib/components/DragDropDropArea.svelte';

	const { slot }: { slot: CardSlotData } = $props();
	const dragDropContext = getCardDragDropContext();
	const gameContext = getGameContext();

	const amIAvailableForDraggedCard = $derived(
		gameContext.gameManager.isItMyTurn &&
			(!slot.cardId ||
				(!!dragDropContext.draggedCard && slot.cardId === dragDropContext.draggedCard.id))
	);

	const isMatchingCardDragged = $derived(
		!!dragDropContext.draggedCard &&
			canPutRealCardOnSlot(dragDropContext.draggedCard, slot.expectedCard)
	);

	const highlight = $derived(amIAvailableForDraggedCard && isMatchingCardDragged);

	function handleDrop() {
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

<DragDropDropArea
	isAnyElementDragged={!!dragDropContext.draggedCard}
	onElementDropped={handleDrop}
	disableDragDrop={!gameContext.gameManager.isItMyTurn}
>
	{#snippet content(isCardOverThisSlot)}
		<div
			class={[
				highlight ? 'highlighted' : '',
				amIAvailableForDraggedCard && isMatchingCardDragged && isCardOverThisSlot
					? 'matching-card-over'
					: ''
			]}
		>
			{#if slot.cardId && allCardsById.has(slot.cardId)}
				<DragabbleCard cardData={allCardsById.get(slot.cardId)!} draggedFrom={slot} />
			{:else}
				<div style:opacity={0.2}>
					<Card cardData={slot.expectedCard} />
				</div>
			{/if}
		</div>
	{/snippet}
</DragDropDropArea>

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
</style>
