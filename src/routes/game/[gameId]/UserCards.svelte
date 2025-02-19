<script lang="ts">
	import type { UserCard } from '$lib/domain/userCards';
	import DragabbleCard from '$lib/components/DragabbleCard.svelte';
	import OrderByColorButton from './OrderByColorButton.svelte';
	import OrderByColorAndSequentialButton from './OrderByValueAndSequentialButton.svelte';
	import OrderByNumberButton from './OrderByNumberButton.svelte';
	import CardDropTarget from '$lib/components/CardDropTarget.svelte';
	import { getCardSizeContext } from '$lib/domain/cards';
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

	const cardsAndDropTargets: UserCard[] = $derived([
		...cards,
		...Array(Math.max(totalItems - cards.length, 0)).fill(null)
	]);
</script>

<div class="user-cards-container" use:resizeObserver onresize={handleResize}>
	<div class="user-cards">
		{#each cardsAndDropTargets as card, index}
			{#if card === null}
				<CardDropTarget {index} {height} {width} dropTargetWidth="{itemWidth + 6}px" />
			{:else}
				<DragabbleCard cardData={card} draggedFrom={null} />
			{/if}
		{/each}
	</div>
	<div class="user-cards-order-buttons">
		<OrderByNumberButton />
		<OrderByColorButton />
		<OrderByColorAndSequentialButton />
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
