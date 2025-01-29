<script lang="ts">
	import { type RealCardData } from '../../domain/card';
	import { currentlyDraggedCardState } from '../../stores/dragdropStore.svelte';
	import Card from './Card.svelte';

	let { cardData }: { cardData: RealCardData } = $props();

	let isDragging = $state(false);

	function onDragStart(event: DragEvent) {
		try {
			isDragging = true;
			const cardDataSnapshot = $state.snapshot(cardData);
			console.log('onDragStart', cardDataSnapshot);
			currentlyDraggedCardState.draggedCard = cardDataSnapshot;
		} catch (error) {
			console.error('onDragStart', error);
		}
	}

	function onDragEnd(event: DragEvent) {
		try {
			console.log('onDragEnd', $state.snapshot(cardData));
			currentlyDraggedCardState.draggedCard = null;
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
