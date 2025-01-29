<script lang="ts">
	import type { CardSlotData } from '../domain/board';
	import { getCardDragDropContext, isCardsEqual, type CardData } from '../domain/card';
	import Card from './Card.svelte';

	const { slot }: { slot: CardSlotData } = $props();

	const currentDraggedCard = getCardDragDropContext();

	let isDragged = $derived(isCardsEqual(currentDraggedCard, slot.card ?? slot.expectedCard));

	isDragged && console.log('isDragged', $state.snapshot(isDragged), currentDraggedCard);
</script>

<div class={currentDraggedCard ? 'dragged' : ''} style:opacity={slot.card ? 1 : 0.2}>
	<Card cardData={slot.card ?? slot.expectedCard} isDraggable={slot.card ? false : true} />
</div>

<style>
	.dragged {
		border: 2px solid yellow;
	}
</style>
