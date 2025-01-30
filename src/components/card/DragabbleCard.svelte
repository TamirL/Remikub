<script lang="ts">
	import type { CardSlotData } from '../../domain/board';
	import { getCardDragDropContext, type RealCardData } from '../../domain/card';
	import Card from './Card.svelte';

	let { cardData, draggedFrom }: { cardData: RealCardData, draggedFrom: CardSlotData | null } = $props();

	let isDragging = $state(false);
	let currentDraggedCard = getCardDragDropContext();

	function onDragStart(event: DragEvent) {
		isDragging = true;
		currentDraggedCard.draggedCard = cardData;
		currentDraggedCard.draggedFrom = draggedFrom;
	}

	function onDragEnd(event: DragEvent) {
		currentDraggedCard.draggedCard = null;
		currentDraggedCard.draggedFrom = null;
		isDragging = false;
	}
</script>

<div
	class={isDragging ? 'dragging' : ''}
	role="listitem"
	draggable={true}
	ondragstart={onDragStart}
	ondragend={onDragEnd}
>
	<Card {cardData} />
</div>

<style>
	.dragging {
		opacity: 0.5;
	}
</style>
