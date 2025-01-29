<script lang="ts">
	import type { CardData } from '../domain/card';
	import Card from './Card.svelte';

	let { cards }: { cards: CardData[] } = $props();
</script>

<div class="user-cards">
	{#each cards as card}
		<Card cardData={card} isDraggable={true} />
	{/each}
</div>

<style>
	.user-cards {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 10px 5px;

		background-color: brown;
		padding: 20px;

		flex: 0 0 auto;
	}
</style>
