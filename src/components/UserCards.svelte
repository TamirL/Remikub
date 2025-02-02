<script lang="ts">
	import type { RealCardData } from '../domain/card';
	import DragabbleCard from '$lib/DragabbleCard.svelte';
	import DrawCardButton from './DrawCardButton.svelte';
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
	<div class="user-cards-buttons">
		<div class="user-cards-order-buttons">
			<OrderByNumberButton />
			<OrderByColorButton />
		</div>
		<DrawCardButton />
	</div>
</div>

<style>
	.user-cards-container {
		display: flex;
		flex-direction: row;
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

	.user-cards-buttons {
		flex: 0 0 auto;
		display: flex;
		flex-direction: row;
	}
</style>
