<script lang="ts">
	import type { UserCard } from '$lib/domain/userCards';
	import DragabbleCard from '$lib/components/DragabbleCard.svelte';
	import OrderByColorButton from './OrderByColorButton.svelte';
	import OrderByValueAndSequentialButton from './OrderByValueAndSequentialButton.svelte';
	import OrderByValueButton from './OrderByValueButton.svelte';
	import CardDropTarget from '$lib/components/CardDropTarget.svelte';
	import { getCardSizeContext, type RealCardData } from '$lib/domain/cards';
	import { resizeObserver } from '$lib/actions/resizeObserver.svelte';

	const { cards }: { cards: readonly UserCard[] } = $props();

	const { width, widthPx: itemWidth, height, heightPx: itemHeight } = getCardSizeContext();

	let containerWidth = $state(0);
	let containerHeight = $state(0);

	function handleResize(event: CustomEvent<{ width: number; height: number }>) {
		containerWidth = event.detail.width;
		containerHeight = event.detail.height;
	}

	const totalItems = $derived.by(() => {
		const paddingLeft = 10,
			paddingRight = 10;
		const paddingTop = 10,
			paddingBottom = 10;

		const gap = 10; // gap between items

		// Calculate effective dimensions
		const effectiveWidth = containerWidth - (paddingLeft + paddingRight);
		const effectiveHeight = containerHeight - (paddingTop + paddingBottom);

		// Calculate how many items fit per row and per column
		const itemsPerRow = Math.floor((effectiveWidth + gap) / (itemWidth + gap));
		const rows = Math.floor((effectiveHeight + gap) / (itemHeight + gap));
		return itemsPerRow * rows;
	});

	type CardOrDropTarget =
		| {
				isDropTarget: true;
				card: null;
				id: string;
		  }
		| {
				isDropTarget: false;
				card: RealCardData;
				id: number;
		  };

	const cardsAndDropTargets: CardOrDropTarget[] = $derived.by(() => {
		return [...cards, ...Array(Math.max(totalItems - cards.length, 0)).fill(null)].map(
			(cardOrNull, index): CardOrDropTarget => {
				if (cardOrNull === null) {
					return {
						isDropTarget: true,
						card: null,
						id: `drop-target-${index}`
					};
				}

				return {
					isDropTarget: false,
					card: cardOrNull,
					id: cardOrNull.id
				};
			}
		);
	});

	$inspect(cardsAndDropTargets);
</script>

<div class="user-cards-container" use:resizeObserver onelementresize={handleResize}>
	<div class="user-cards">
		{#each cardsAndDropTargets as cardOrDropTarget, index (cardOrDropTarget.id)}
			{#if cardOrDropTarget.isDropTarget}
				<CardDropTarget {index} {height} {width} dropTargetWidth="{itemWidth + 6}px" />
			{:else}
				<DragabbleCard cardData={cardOrDropTarget.card} draggedFrom={null} />
			{/if}
		{/each}
	</div>
	<div class="user-cards-order-buttons">
		<OrderByColorButton />
		<OrderByValueButton />
		<OrderByValueAndSequentialButton />
	</div>
</div>

<style>
	.user-cards-container {
		display: flex;
		flex-direction: row;

		flex: 1;
	}

	.user-cards {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		align-content: flex-start;
		flex-wrap: wrap;
		gap: 10px 6px;

		background-color: brown;
		padding: 20px;

		flex: 1;
	}

	.user-cards-order-buttons {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
	}
</style>
