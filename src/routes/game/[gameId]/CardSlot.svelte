<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { CardSlotData } from '$lib/domain/board';
	import {
		allCardsById,
		canPutRealCardOnSlot,
		cardDragDropContext,
		type DraggedCardData
	} from '$lib/domain/cards';
	import { getGameContext } from '$lib/domain/game';
	import { dndzone, type Options, type DndEvent, TRIGGERS } from 'svelte-dnd-action';
	import { untrack } from 'svelte';

	const { slot }: { slot: CardSlotData } = $props();
	const dragDropContext = cardDragDropContext.get();
	const gameContext = getGameContext();

	function getItemsFromSlotData(slot: CardSlotData): DraggedCardData[] {
		return slot.cardId
			? [{ id: slot.cardId, draggedCard: allCardsById.get(slot.cardId)!, draggedFromSlot: slot }]
			: [];
	}

	let items: DraggedCardData[] = $state(getItemsFromSlotData(slot));

	$effect(() => {
		const newItems = getItemsFromSlotData(slot);
		untrack(() => (items = newItems));
	});

	const amIAvailableForAnyDraggedCard = $derived(
		gameContext.gameManager.isItMyTurn &&
			(!slot.cardId ||
				(!!dragDropContext.current && slot.cardId === dragDropContext.current.draggedCard.id))
	);

	const isMatchingCardDragged = $derived(
		!!dragDropContext.current &&
			canPutRealCardOnSlot(dragDropContext.current.draggedCard, slot.expectedCard)
	);

	const highlight = $derived(amIAvailableForAnyDraggedCard && isMatchingCardDragged);

	function onConsider(e: CustomEvent<DndEvent<DraggedCardData>>) {
		console.log('Slot onConsider', { detail: e.detail });
		items = e.detail.items;

		if (e.detail.info.trigger == TRIGGERS.DRAG_STARTED) {
			dragDropContext.current = e.detail.items[0];
		}
	}

	function onFinalized(e: CustomEvent<DndEvent<DraggedCardData>>) {
		console.log('Slot onFinalized', { detail: e.detail });

		resetItemsState();

		if (e.detail.info.trigger === TRIGGERS.DROPPED_OUTSIDE_OF_ANY) {
			dragDropContext.current = null;
			return;
		}

		if (e.detail.info.trigger !== TRIGGERS.DROPPED_INTO_ZONE) {
			return;
		}

		const dragDropContextData = dragDropContext.current;

		dragDropContext.current = null;

		if (!dragDropContextData) {
			console.error('No card to drop');
			return;
		}

		if (!gameContext.gameManager.isItMyTurn) {
			console.error('Not your turn');
			return;
		}

		if (dragDropContextData.draggedFromSlot) {
			gameContext.gameManager.moveCardFromSlot(dragDropContextData.draggedFromSlot, slot);
		} else {
			gameContext.gameManager.moveCardFromUserCards(dragDropContextData.draggedCard, slot);
		}
	}

	function resetItemsState() {
		items = getItemsFromSlotData(slot);
	}

	const options: Options<DraggedCardData> = $derived({
		items,
		dropFromOthersDisabled: !highlight,
		flipDurationMs: 0,
		dragDisabled: slot.cardId === null
		// dropTargetClasses: ['matching-card-over']
	});
</script>

<div class="card-slot">
	<div class="card-placeholder">
		<Card cardData={slot.expectedCard} />
	</div>
	<div use:dndzone={options} onconsider={onConsider} onfinalize={onFinalized}>
		{#each items as item (item.id)}
			<div class={[highlight ? 'highlighted' : '']}>
				<Card cardData={slot.expectedCard} />
			</div>
		{/each}
	</div>
</div>

<style>
	.card-slot {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;

		& > * {
			grid-column: 1;
			grid-row: 1;
		}
	}

	.card-placeholder {
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0.2;

		/* The placeholder is not interactive */
		pointer-events: none;
	}

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
