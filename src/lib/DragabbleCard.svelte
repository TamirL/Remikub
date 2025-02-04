<script lang="ts">
	import type { CardSlotData } from '../domain/board';
	import { getCardDragDropContext, type RealCardData } from '../domain/card';
	import Card from './Card.svelte';

	let { cardData, draggedFrom }: { cardData: RealCardData; draggedFrom: CardSlotData | null } =
		$props();

	let isDragging = $state(false);
	let currentDraggedCard = getCardDragDropContext();

	function onDragStart(event: DragEvent) {
		// Chrome does not allow the drag if we change the DOM at the same time, so we need to delay the change by one tick
		setTimeout(() => {
			isDragging = true;
			currentDraggedCard.draggedCard = cardData;
			currentDraggedCard.draggedFrom = draggedFrom;
		});
	}

	function onDragEnd(event: DragEvent) {
		currentDraggedCard.draggedCard = null;
		currentDraggedCard.draggedFrom = null;
		isDragging = false;
	}
</script>

<div
	class={['draggable', isDragging ? 'dragging' : '']}
	role="listitem"
	draggable={true}
	ondragstart={onDragStart}
	ondragend={onDragEnd}
>
	<Card {cardData} />
</div>

<style>
	.draggable {
		cursor: grab;

		/* This is a hack to make the card not have the red background when dragging, 
		   this works because it creates a new stacking context */
		translate: 0px 0px;
	}
	.dragging {
		opacity: 0.5;
	}
</style>
