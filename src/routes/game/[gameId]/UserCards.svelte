<script lang="ts">
	import type { RealCardData } from '$lib/domain/cards';
	import DragabbleCard from '$lib/components/DragabbleCard.svelte';
	import OrderByColorButton from './OrderByColorButton.svelte';
	import OrderByNumberButton from './OrderByNumberButton.svelte';

	let { cards }: { cards: readonly RealCardData[] } = $props();
</script>

<div class="user-cards-container">
	<div class="user-cards">
		{#each cards as card (card.id)}
			<DragabbleCard cardData={card} draggedFrom={null} />
		{/each}
	</div>
	<div class="user-cards-order-buttons">
		<OrderByNumberButton />
		<OrderByColorButton />
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
		flex-direction: row;
	}
</style>
