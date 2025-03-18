<script lang="ts">
	import type { UserCard } from '$lib/domain/userCards';
	import OrderByColorButton from './OrderByColorButton.svelte';
	import OrderByValueAndSequentialButton from './OrderByValueAndSequentialButton.svelte';
	import OrderByValueButton from './OrderByValueButton.svelte';
	import CardDropTarget from '$lib/components/CardDropTarget.svelte';
	import { cardSizeContext, type RealCardData } from '$lib/domain/cards';
	import { sizeObserver } from '$lib/actions/sizeObserver.svelte';

	const { cards }: { cards: readonly UserCard[] } = $props();

	const { width, widthPx: itemWidth, height, heightPx: itemHeight } = cardSizeContext.get().current;

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

		const rowGap = 10; // gap between items
		const columnGap = 6; // gap between items

		// Calculate effective dimensions
		const effectiveWidth = containerWidth - (paddingLeft + paddingRight);
		const effectiveHeight = containerHeight - (paddingTop + paddingBottom);

		// Calculate how many items fit per row and per column
		const itemsPerRow = Math.floor((effectiveWidth + columnGap) / (itemWidth + columnGap));
		const rows = Math.floor((effectiveHeight + rowGap) / (itemHeight + rowGap));

		return Math.max(itemsPerRow * rows, cards.length);
	});

	type CardOrDropTarget = {
		card: RealCardData | null;
		id: number | string;
	};

	const cardsAndDropTargets: CardOrDropTarget[] = $derived.by(() => {
		return [
			...cards,
			...(Array(Math.max(totalItems - cards.length, 0)).fill(null) as UserCard[])
		].map((cardOrNull, index): CardOrDropTarget => {
			return {
				card: cardOrNull,
				id: cardOrNull?.id ?? `drop-target-${index}`
			};
		});
	});
</script>

<div class="user-cards-container">
	<div class="user-cards" onelementresize={handleResize} use:sizeObserver>
		{#each cardsAndDropTargets as cardOrDropTarget, index (cardOrDropTarget.id)}
			<CardDropTarget
				{index}
				{height}
				{width}
				cardData={cardOrDropTarget.card}
				dropTargetWidth="{itemWidth + 6}px"
			/>
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
