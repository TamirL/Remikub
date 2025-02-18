<script lang="ts">
	import { splitArrayByNulls } from '$lib/utils/arrayUtils';
	import type { UserCard } from '$lib/domain/userCards';
	import DragabbleCard from '$lib/components/DragabbleCard.svelte';
	import OrderByColorButton from './OrderByColorButton.svelte';
	import OrderByColorAndSequentialButton from './OrderByValueAndSequentialButton.svelte';
	import OrderByNumberButton from './OrderByNumberButton.svelte';

	const { cards }: { cards: readonly UserCard[] } = $props();
	const cardsBlocks = $derived(splitArrayByNulls(cards));
</script>

<div class="user-cards-container">
	<div class="user-cards">
		{#each cardsBlocks as cardBlock}
			<div class="card-block">
				{#each cardBlock as card (card.id)}
					<DragabbleCard cardData={card} draggedFrom={null} />
				{/each}
			</div>
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

	.card-block {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 10px 5px;
		padding-inline-end: 20px;
	}

	.user-cards-order-buttons {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
	}
</style>
