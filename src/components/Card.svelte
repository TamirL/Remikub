<script lang="ts">
	import type { CardData } from '../domain/card';
	import { getCssCardColor, getCardSizeContext, setCardDragDropContext } from '../domain/card';

	let { cardData, isDraggable }: { cardData: CardData; isDraggable: boolean } = $props();
	let cardColor = getCssCardColor(cardData);

	let { width, height } = getCardSizeContext();

	let isDragging = $state(false);

	$effect(() => {
		if (isDragging) {
			console.log('setCardDragDropContext', cardData);
			setCardDragDropContext(cardData);
		} else {
			console.log('clearCardDragDropContext', cardData);
			setCardDragDropContext(null);
		}
	});

	function onDragStart(event: DragEvent) {
		try {
			event.preventDefault();
			isDragging = true;
			console.log('onDragStart', cardData);
		} catch (error) {
			console.error('onDragStart', error);
		}
	}

	function onDragEnd(event: DragEvent) {
		try {
			isDragging = false;
			console.log('onDragEnd', cardData);
		} catch (error) {
			console.error('onDragEnd', error);
		}
	}
</script>

<div
	style:color={cardColor}
	style:width
	style:height
	class={['card', isDragging ? 'dragging' : '']}
	role="listitem"
	draggable={isDraggable}
	ondragstart={onDragStart}
	ondragend={onDragEnd}
>
	<div class="card-content">
		{cardData.type === 'number' ? cardData.numericValue : 'JK'}
	</div>
</div>

<style>
	.card {
		display: flex;
		justify-content: center;
		align-items: center;

		background-color: #c1aea5;

		border-radius: 10px;
		container: card / inline-size;
		border: 1px solid black;
		user-select: none;
		line-height: normal;
	}

	@container card (min-width: 0) {
		.card-content {
			font-size: 80cqmin;
		}
	}

	.dragging {
		opacity: 0.5;
	}
</style>
