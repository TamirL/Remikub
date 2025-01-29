<script lang="ts">
	import { setCardDataOnDragDropEvent, type RealCardData } from '../../domain/card';
	import Card from './Card.svelte';

	let { cardData }: { cardData: RealCardData } = $props();

	let isDragging = $state(false);

	console.log($state.snapshot(isDragging), cardData);

	function onDragStart(event: DragEvent) {
		try {
			console.log('onDragStart', cardData);
			isDragging = true;
			setCardDataOnDragDropEvent(event, $state.snapshot(cardData));
		} catch (error) {
			console.error('onDragStart', error);
		}
	}

	function onDragEnd(event: DragEvent) {
		try {
			console.log('onDragEnd', cardData);
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
