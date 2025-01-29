<script lang="ts">
	import type { RealCardData } from '../domain/card';
	import DragabbleCard from './card/DragabbleCard.svelte';

	let { cards }: { cards: RealCardData[] } = $props();
</script>

<div class="user-cards">
	{#each cards as card}
		<DragabbleCard cardData={card} />
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
