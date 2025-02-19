<script lang="ts">
	import type { UserCard } from '$lib/domain/userCards';
	import DragabbleCard from '$lib/components/DragabbleCard.svelte';
	import OrderByColorButton from './OrderByColorButton.svelte';
	import OrderByColorAndSequentialButton from './OrderByValueAndSequentialButton.svelte';
	import OrderByNumberButton from './OrderByNumberButton.svelte';
	import CardDropTarget from '$lib/components/CardDropTarget.svelte';
	import { getCardSizeContext } from '$lib/domain/cards';

	const { cards }: { cards: readonly UserCard[] } = $props();

	const { width, height } = getCardSizeContext();
</script>

<div class="user-cards-container">
	<div class="user-cards">
		{#each cards as card, index (card?.id)}
			{#if card === null}
				<CardDropTarget {index} {height} {width} dropTargetWidth={width} />
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
		flex-wrap: wrap;
		gap: 10px 5px;

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
