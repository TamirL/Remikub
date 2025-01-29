<script lang="ts">
	import { getCardDragDropContext, type RealCardData } from '../../domain/card';
	import Card from './Card.svelte';

	let { cardData }: { cardData: RealCardData } = $props();

	let isDragging = $state(false);
	let currentDraggedCard = getCardDragDropContext();

	function onDragStart(event: DragEvent) {
		try {
			isDragging = true;
			currentDraggedCard.draggedCard = cardData;
		} catch (error) {
			console.error('onDragStart', error);
		}
	}

	function onDragEnd(event: DragEvent) {
		try {
			currentDraggedCard.draggedCard = null;
			isDragging = false;
		} catch (error) {
			console.error('onDragEnd', error);
		}
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
